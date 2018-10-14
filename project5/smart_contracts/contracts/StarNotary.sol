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

    /**
    * Create star
    *
    * @param name The name of the star
    * @param story The story
    * @param ra The ra of the star
    * @param dec The dec of the star
    * @param mag The mag of the star
    */
    function createStar(string name, string story,  string ra, string dec, string mag) public {
        tokenCount++;
        uint256 tokenId = tokenCount;

        //check if tokenId already exists
        require(keccak256(abi.encodePacked(tokenIdToStarInfo[tokenId].coordinates.dec)) == keccak256(""));

        //check input 
        require(keccak256(abi.encodePacked(ra)) != keccak256(""));
        require(keccak256(abi.encodePacked(dec)) != keccak256(""));
        require(keccak256(abi.encodePacked(mag)) != keccak256(""));
        require(tokenId != 0);
        require(!checkIfStarExist(ra, dec, mag));

        Coordinates memory newCoordinates = Coordinates(ra, dec, mag);
        Star memory newStar = Star(name, story, newCoordinates);

        tokenIdToStarInfo[tokenId] = newStar;

        bytes32 hash = generateStarHash(ra, dec, mag);
        starHashMap[hash] = true;

        _mint(msg.sender, tokenId);
    }

    function putStarUpForSale(uint256 tokenId, uint256 price) public { 
        require(this.ownerOf(tokenId) == msg.sender);

        starsForSale[tokenId] = price;
    }

    function buyStar(uint256 tokenId) public payable { 
        require(starsForSale[tokenId] > 0);
        
        uint256 starCost = starsForSale[tokenId];
        address starOwner = this.ownerOf(tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, tokenId);
        _addTokenTo(msg.sender, tokenId);
        
        starOwner.transfer(starCost);

        if (msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string ra, string dec, string mag) public view returns(bool) {
        return starHashMap[generateStarHash(ra, dec, mag)];
    }

    function generateStarHash(string ra, string dec, string mag) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(ra, dec, mag));
    }

    function tokenIdToStarInfo(uint256 tokenId) public view returns(string, string, string, string, string) {
        return (tokenIdToStarInfo[tokenId].name, tokenIdToStarInfo[tokenId].story, tokenIdToStarInfo[tokenId].coordinates.ra, tokenIdToStarInfo[tokenId].coordinates.dec, tokenIdToStarInfo[tokenId].coordinates.mag);
    }

    function mint(uint256 tokenId) public {
        super._mint(msg.sender, tokenId);
    }
}