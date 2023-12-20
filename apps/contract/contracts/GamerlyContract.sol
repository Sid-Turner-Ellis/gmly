// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// /**
//     HOw to test:

//     - Deploy the contract to the local network
//     - You can then impersonate a signer - https://www.npmjs.com/package/hardhat-deal

//  */

interface USDC {
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    // function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract GamerlyContract {
    address private owner;
    USDC private USDc;
    mapping(address => uint256) private walletToBalance;
    event TransactionEvent(
        string transactionType, 
        uint256 amount, 
        address indexed fromAddress,
        uint teamProfileId,
        uint teamId,
        uint wagerId
    );

    constructor(address _usdcAddress) {
        // TODO: Create the first escrow in the mapping
        // TODO: The contract address of USDC
        USDc = USDC(_usdcAddress);
        owner = msg.sender;
        walletToBalance[msg.sender] = 0;
    }

    function balanceOf(address wallet) public view returns (uint256 balance)  {
        return walletToBalance[wallet];
    }

    function balance() public view returns (uint256 balance)  {
        return walletToBalance[msg.sender];
    }

// TODO: Make sure that if there are errors then the event does not occur
    function deposit(uint256 amount) public {
        // TODO: uncomment when on USDC
        // Check if the sender has enough USDC
        // uint256 senderBalance = USDc.balanceOf(msg.sender);
        // require(senderBalance >= amount, "Insufficient USDC balance");

        // Check if the sender has approved the contract to spend at least the deposit amount
        // uint256 allowance = USDc.allowance(msg.sender, address(this));
        // require(allowance >= amount, "Insufficient allowance for contract to transfer USDC");

        require(USDc.transferFrom(msg.sender, address(owner), amount), "Transfer failed");
        walletToBalance[msg.sender] += amount;
        emit TransactionEvent("DEPOSIT", amount, msg.sender, 0, 0, 0);
    }

    function withdraw(uint256 amount) public {
        // ---TODO: So the USDC is stored on the contract address - how can we withdraw it---
        // The wallet that deploys the contract will have the USDC
        require(walletToBalance[msg.sender] >= amount, "Insufficient funds");
        require(USDc.transferFrom(address(owner),msg.sender, amount), "Transfer failed");
        walletToBalance[msg.sender] -= amount;
        
        emit TransactionEvent("WITHDRAW", amount, msg.sender, 0, 0, 0);
    }
}