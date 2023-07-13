// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract DEMETokenSBT is ERC721, AccessControl{

    uint256 public totalSupply = 0;
    uint256 public maxTotalSupply = 10000;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bool public canTransfer = false;
    string public contractURI;
    string public baseURI;

    constructor(string memory _name, string memory _symbol, string memory _contractURI, string memory _baseURI) ERC721(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        contractURI = _contractURI;
        baseURI = _baseURI;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return
        super.supportsInterface(interfaceId) ||
        interfaceId == type(AccessControl).interfaceId;
    }

    function setCanTransfer(bool _canTransfer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        canTransfer = _canTransfer;
    }

    function setBaseURI(string memory _baseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _baseURI;
    }

    function burn(uint256 tokenId) external {
        _burn(tokenId);
    }

    function mintTo(address _to) external onlyRole(MINTER_ROLE) returns (uint256) {
        totalSupply += 1;
        require(totalSupply <= maxTotalSupply, "Insufficient balance");
        uint256 tokenId = totalSupply;
        _mint(_to, tokenId);
        return tokenId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override (ERC721) {
        if (!canTransfer && from!=address(0) && to != address(0) ){
            revert("can not transfer");
        }
    }
}
