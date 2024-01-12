// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./IERC20.sol";
import "hardhat/console.sol";

contract Gamerly is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    IERC20 private USDC;

    enum TransactionType { Deposit, Withdraw }

    struct Transaction {
        uint256 id;
        TransactionType transactionType;
        address profileAddress;
        uint256 amount;
        bool valid;
    }

    mapping(uint256 => Transaction) private transactions;
    uint256[] private transactionIds;

    error TransactionIdAlreadyExists();
    error InsufficientBalance();
    error InsufficientAllowance();
    error TransferFailed();

    modifier validateTransaction(uint256 transactionId, address profileAddress, uint256 amount) {
        if (transactions[transactionId].valid) revert TransactionIdAlreadyExists();
        _;
    }

    modifier hasSufficientBalance(address account, uint256 amount) {
        if (USDC.balanceOf(account) < amount) revert InsufficientBalance();
        _;
    }

    modifier hasSufficientAllowance(address account, uint256 amount) {
        if (USDC.allowance(account, address(this)) < amount) revert InsufficientAllowance();
        _;
    }

    function initialize(address _usdcAddress) initializer public {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        USDC = IERC20(_usdcAddress);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function deposit(uint256 transactionId, address profileAddress, uint256 amount)
        external onlyOwner validateTransaction(transactionId, profileAddress, amount)
        hasSufficientBalance(profileAddress, amount) hasSufficientAllowance(profileAddress, amount)
    {
        if (!USDC.transferFrom(profileAddress, address(this), amount)) revert TransferFailed();
        _recordTransaction(transactionId, TransactionType.Deposit, profileAddress, amount);
    }

    function withdraw(uint256 transactionId, address profileAddress, uint256 amount)
        external onlyOwner validateTransaction(transactionId, profileAddress, amount)
        hasSufficientBalance(address(this), amount)
    {
        if (!USDC.transfer(profileAddress, amount)) revert TransferFailed();
        _recordTransaction(transactionId, TransactionType.Withdraw, profileAddress, amount);
    }

    function withdrawToOwner(uint256 amount) external onlyOwner hasSufficientBalance(address(this), amount) {
        if (!USDC.transfer(owner(), amount)) revert TransferFailed();
    }

    function getTransaction(uint256 transactionId) external onlyOwner view returns (Transaction memory transaction) {
        return transactions[transactionId];
    }

    function getTransactionIds() external onlyOwner view returns (uint256[] memory) {
        return transactionIds;
    }

    function _recordTransaction(uint256 transactionId, TransactionType transactionType, address profileAddress, uint256 amount) internal {
        Transaction memory newTransaction = Transaction(transactionId, transactionType, profileAddress, amount, true);
        transactions[transactionId] = newTransaction;
        transactionIds.push(transactionId);
    }
}
