// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// Author: @adriencasta
contract WhiteList {
    mapping(address => bool) public whitelistedAdresses;
    uint8 public maxWhitelistedAdresses;
    uint8 public whitelistedAdressesCount = 0;

    constructor(uint8 _maxWhitelistedAdresses) {
        maxWhitelistedAdresses = _maxWhitelistedAdresses;
    }

    function addAddressToWhiteList() public {
        require(
            !whitelistedAdresses[msg.sender],
            "Address has already been white listed"
        );
        require(
            whitelistedAdressesCount < maxWhitelistedAdresses,
            "More addresses cant be added, limit reached"
        );

        whitelistedAdresses[msg.sender] = true;
        whitelistedAdressesCount++;
    }
}
