## Project overview
Keeping the blockchain dataset in an array is expensive to retain in the computer's memory. In addition, inefficient for long term storage.

In the project boilerplate, all data is held within the chain array. Upon restart, the chain array is refreshed. The data stored is at risk of permanent loss. The project application needs to persist the dataset. LevelDB was selected to solve this problem due to its robustness as a key/value datastore along with its historical usage with Bitcoin.

A core responsibilities of a blockchain nodes is to validate the blockchain dataset. In this project you will learn to validate the blockchain dataset by converting the current validation functions with chain array to LevelDB.

In the project boilerplate, the array needs to be replaced with LevelDB to persist the data.
Functions that once worked with the array should now work with LevelDB.
At the end of the project you will learn the skills needed to create your own private blockchain ledger, persist data, and validate the blockchain ledger utilizing block hashes.

## Project specification

https://review.udacity.com/#!/rubrics/2040/view

---

## Getting Started

```
npm install
```

## Testing

To test code:
Open a command prompt or shell terminal after install node.js and execute:

```
node simpleChain.js
```