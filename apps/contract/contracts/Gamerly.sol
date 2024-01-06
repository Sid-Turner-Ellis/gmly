// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./IERC20.sol";
import "hardhat/console.sol";

contract GamerlyContract {
    address private owner;
    IERC20 private USDC;
    string private globalSomething;

    enum TransactionType {
        Deposit,
        Withdraw
    }

    struct Transaction {
        string id;
        TransactionType transactionType;
        address profileAddress;
        uint256 amount;
    }

    mapping(string => Transaction) private transactions;
    mapping(address => string[]) private transactionsForAddress;

    modifier onlyOwner {
      require(msg.sender == owner);
        _;
    }

    constructor()  {
        owner = msg.sender;
        // This is for eth mainnet right now - we'll likely want to make this configurable for different networks
        USDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    }
 
    function writeSomething(string memory something) public onlyOwner() {
        globalSomething = something;
    }

    function readSomething() public view returns (string memory) {
        return globalSomething;
    }

    function deposit(string memory transactionId, address profileAddress, uint256 amount) public onlyOwner() {
        // get the allowance    
        uint256 profileUsdcBalance = USDC.balanceOf(msg.sender);
        console.log('deposit', transactionId, profileAddress, amount);
        console.log('profileUsdcBalance', profileUsdcBalance);
        require(profileUsdcBalance >= amount, "Insufficient USDC balance");

        // Check if the sender has approved the contract to spend at least the deposit amount
        uint256 allowance = USDC.allowance(profileAddress, address(this));
        console.log('allowance', allowance);
        require(allowance >= amount, "Insufficient allowance for contract to transfer USDC");
        require(USDC.transferFrom(profileAddress, address(this), amount), "Transfer failed");

        // TODO: make sure the transaction id is unique
        Transaction memory newTransaction = Transaction(transactionId, TransactionType.Deposit, profileAddress, amount);
        transactions[transactionId] = newTransaction;
        transactionsForAddress[profileAddress].push(transactionId);
    }

    function withdraw(string memory transactionId, address profileAddress, uint256 amount) public onlyOwner() {
        // get the allowance    
        uint256 contractUsdcBalance = USDC.balanceOf(address(this));
        console.log('withdraw', transactionId, profileAddress, amount);
        console.log('contractUsdcBalance', contractUsdcBalance);
        require(contractUsdcBalance >= amount, "Insufficient USDC balance");

        // TODO: need to check this - not sure if it would be the caller (our server) or the smart contract
        // require(USDC.transferFrom(address(this), profileAddress, amount), "Transfer failed");
        // TODO: Check that transfer will transfer from this smart contract rather than our smart contract wallet
        require(USDC.transfer(profileAddress, amount), "Transfer failed");

        Transaction memory newTransaction = Transaction(transactionId, TransactionType.Withdraw, profileAddress, amount);
        transactions[transactionId] = newTransaction;
        transactionsForAddress[profileAddress].push(transactionId);
    }


    // TODO: Function that moves the USDC to the owner's address
    // Use view not pure


}

