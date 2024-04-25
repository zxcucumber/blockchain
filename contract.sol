// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transfer {

    struct transferMoney{
        uint id;
        address sender;
        address recipient;
        string codeWord;
        uint sum;
        bool status;
    }

    transferMoney[] public transferList;

    function getTransfers() view public returns(transferMoney[] memory) {
        return transferList;
    }

    function sendMoney(address _recipient, string memory _codeWord) public payable {
        require(_recipient != msg.sender, "You can't send money from yourself.");
        require(msg.sender.balance >= msg.value, "You don't have enought money.");
        require(bytes(_codeWord).length > 0, "Code word can not be empty.");
        require(msg.value > 0, "You don't input sum of transaction.");
        transferList.push(transferMoney(transferList.length, msg.sender, _recipient, _codeWord, msg.value, true));
    }

    function getMoney(uint _id, string memory _codeWord) public payable {
        require(_id < transferList.length, "Invalid ID"); 
        require(transferList[_id].recipient == msg.sender, "You can't get money from yourself.");
        require(transferList[_id].status != false, "Transfer is not active.");
        if (keccak256(abi.encode(transferList[_id].codeWord)) == keccak256(abi.encode(_codeWord))) {
            payable(transferList[_id].recipient).transfer(transferList[_id].sum);
        } else {
            payable(transferList[_id].sender).transfer(transferList[_id].sum);
        }
        transferList[_id].status = false;
    }

    function canselTransaction(uint _id) public payable {
        require(_id < transferList.length, "Invalid ID");
        require(transferList[_id].sender == msg.sender, "only sender can cansel transaction");
        require(transferList[_id].status != false, "Transfer is not active.");

        payable(transferList[_id].sender).transfer(transferList[_id].sum);
        transferList[_id].status = false;
    } 

}