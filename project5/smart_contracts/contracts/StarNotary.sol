pragma solidity ^0.4.23;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 { 

    struct Coordinates {
        string ra;
        string dec;
        string mag;
    }

    struct Star { 
        string name;
        string story;
        Coordinates coordinates;
    }

    uint256 public tokenCount;

    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, string _story,  string _ra, string _dec, string _mag) public {
        tokenCount++;
        uint256 _tokenId = tokenCount;

        Coordinates memory newCoordinates = Coordinates(_ra, _dec, _mag);
        Star memory newStar = Star(_name, _story, newCoordinates);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }
}