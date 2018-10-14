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
    mapping(bytes32 => bool) public starHashMap;

    function createStar(string _name, string _story,  string _ra, string _dec, string _mag) public {
        tokenCount++;
        uint256 _tokenId = tokenCount;

        //check if tokenId already exists
        require(keccak256(abi.encodePacked(tokenIdToStarInfo[_tokenId].coordinates.dec)) == keccak256(""));

        //check input 
        require(keccak256(abi.encodePacked(_ra)) != keccak256(""));
        require(keccak256(abi.encodePacked(_dec)) != keccak256(""));
        require(keccak256(abi.encodePacked(_mag)) != keccak256(""));
        require(_tokenId != 0);
        require(!checkIfStarExist(_ra, _dec, _mag));

        Coordinates memory newCoordinates = Coordinates(_ra, _dec, _mag);
        Star memory newStar = Star(_name, _story, newCoordinates);

        tokenIdToStarInfo[_tokenId] = newStar;

        bytes32 hash = generateStarHash(_ra, _dec, _mag);
        starHashMap[hash] = true;

        _mint(msg.sender, _tokenId);
    }

    function checkIfStarExist(string _ra, string _dec, string _mag) public view returns(bool) {
        return starHashMap[generateStarHash(_ra, _dec, _mag)];
    }

    function generateStarHash(string _ra, string _dec, string _mag) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(_ra, _dec, _mag));
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string, string, string, string, string){
        return (tokenIdToStarInfo[_tokenId].name, tokenIdToStarInfo[_tokenId].story, tokenIdToStarInfo[_tokenId].coordinates.ra, tokenIdToStarInfo[_tokenId].coordinates.dec, tokenIdToStarInfo[_tokenId].coordinates.mag);
    }
}