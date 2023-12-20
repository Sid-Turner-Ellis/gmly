// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract FakeUSDCContract {
    string public name = "MockUSDC";
    string public symbol = "mUSDC";
    mapping(address => uint256) public balances;

    constructor() {
        balances[msg.sender] = 1000;
        // Remix wallets
        balances[0x5B38Da6a701c568545dCfcB03FcB875f56beddC4] = 1000;
        balances[0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2] = 1000;
        balances[0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db] = 1000;
        // Hardhat local wallets
        balances[0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266] = 1000;
        balances[0x70997970C51812dc3A010C7d01b50e0d17dc79C8] = 1000;
        balances[0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC] = 1000;
    }


    function setBalance(address _address, uint256 _newBalance) public returns (bool success) {
        balances[_address] = _newBalance;

        return true;
    }

    function balanceOf(address _address) view public returns (uint256 balance) {
        return balances[_address];
    }


    function transfer(address _to, uint256 _value) public returns (bool success)  {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balances[_from]);
        balances[_from] -= _value;
        balances[_to] += _value;
        return true;
    }
}
