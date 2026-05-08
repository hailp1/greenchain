// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FWDAnchor is Ownable {
    event RootAnchored(bytes32 indexed root, uint256 blockNumber, uint256 timestamp);
    
    mapping(bytes32 => uint256) public anchoredRoots; // root -> blockNumber

    constructor() Ownable(msg.sender) {}

    function anchorRoot(bytes32 _root) external onlyOwner {
        anchoredRoots[_root] = block.number;
        emit RootAnchored(_root, block.number, block.timestamp);
    }

    function isRootAnchored(bytes32 _root) external view returns (bool) {
        return anchoredRoots[_root] > 0;
    }
}
