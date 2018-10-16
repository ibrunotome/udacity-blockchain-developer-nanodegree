## Build status

[![Build Status](https://semaphoreci.com/api/v1/ibrunotome/udacity-blockchain-developer-nanodegree/branches/master/badge.svg)](https://semaphoreci.com/ibrunotome/udacity-blockchain-developer-nanodegree)

## Project overview

Build additional functionality with your smart contract and deploy it on the public testnet to create a DApp.

## Project specification 

https://review.udacity.com/#!/rubrics/2297/view

## console output

/home# truffle migrate --network rinkeby --reset --compile-all
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/StarNotary.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/introspection/ERC165.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/introspection/IERC165.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/utils/Address.sol...
Writing artifacts to ./build/contracts

Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0x99a0c5ca378edc99232f614ff121f393957dfd374c2eea6ab8c66a8c257c5800
  Migrations: 0xc0b7a2ccaf3a42d0d550678d9c2860c2391a9fe7
Saving successful migration to network...
  ... 0x7aa27f4237f6164c824fc324d90fb57668c2ba6aef001c43e5cc0006ffea9543
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Replacing StarNotary...
  ... 0x15a1a5a851e06d7308025c871b4ec32fc0521822c2243772a1a17e52bfbd687f
  StarNotary: 0xc6df2f74bec1e32811f0c268f0814ddd2efb7630
Saving successful migration to network...
  ... 0x84940f35e026fb2ac24a4e35a2f5b490c216ee1ba5f09a1100f7d2bacc5b864a
Saving artifacts...

## contract address
0xc6df2f74bec1e32811f0c268f0814ddd2efb7630
https://rinkeby.etherscan.io/address/0xc6df2f74bec1e32811f0c268f0814ddd2efb7630

## contract hash
0x15a1a5a851e06d7308025c871b4ec32fc0521822c2243772a1a17e52bfbd687f
https://rinkeby.etherscan.io/tx/0x15a1a5a851e06d7308025c871b4ec32fc0521822c2243772a1a17e52bfbd687f

## transaction hash
0xce11aabe8ed3ec1a1b45f6e080a6be3ed721e1fca53ee76464af5c8d2c2a5606
https://rinkeby.etherscan.io/tx/0xce11aabe8ed3ec1a1b45f6e080a6be3ed721e1fca53ee76464af5c8d2c2a5606

## star tokenId
1

## Udacity honor code

Giving credits for places that helped me to do this project

- Yury Prokashev, helped me on the slack channel to configure 2_deploy_contracts.js
- https://walkingtree.tech/deploying-a-smart-contract-in-rinkeby-using-infura/
- Udacity concepts section
- Udacity Decentralized Star Notary Project at: https://study-hall.udacity.com/sg-562321-1911/rooms/community:nd1309:562321-cohort-1911-project-2297
