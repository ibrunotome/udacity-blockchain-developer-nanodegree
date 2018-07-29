const SHA256 = require('crypto-js/sha256')
const Block = require('./block')

/**
 * Criteria: Configure simpleChain.js with levelDB to persist blockchain dataset using the level Node.js library.
 */
const level = require('level')
const chainDB = './chaindata'
const db = level(chainDB)

class Blockchain {
  constructor() {
    /**
     * Criteria: Genesis block persist as the first block in the blockchain using LevelDB.
     */
    this.getBlockHeight().then((height) => {
      if (height === -1) {
        this.addBlock(new Block("Genesis block")).then(() => console.log("Genesis block added!"))
      }
    })
  }

  /**
   * Criteria: addBlock(newBlock) function includes a method to store newBlock with LevelDB.
   * 
   * @param {Block} newBlock 
   */
  async addBlock(newBlock) {
    const height = parseInt(await this.getBlockHeight())

    newBlock.height = height + 1
    newBlock.time = new Date().getTime().toString().slice(0, -3)

    if (newBlock.height > 0) {
      const prevBlock = await this.getBlock(height)
      newBlock.previousBlockHash = prevBlock.hash
      console.log(`Previous hash: ${newBlock.previousBlockHash}`)
    }

    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()
    console.log(`New hash: ${newBlock.hash}`)

    await this.addBlockToDB(newBlock.height, JSON.stringify(newBlock))
  }

  /**
   * Criteria: Modify getBlockHeight() function to retrieve current block height within the LevelDB chain.
   */
  async getBlockHeight() {
    return await this.getBlockHeightFromDB()
  }

  /**
   * Criteria: Modify getBlock() function to retrieve a block by it's block heigh within the LevelDB chain.
   * 
   * @param {int} blockHeight 
   */
  async getBlock(blockHeight) {
    return JSON.parse(await this.getBlockFromDB(blockHeight))
  }

  /**
   * Criteria: Modify the validateBlock() function to validate a block stored within levelDB.
   * 
   * @param {int} blockHeight 
   */
  async validateBlock(blockHeight) {
    let block = await this.getBlock(blockHeight);
    let blockHash = block.hash;
    block.hash = '';
    
    let validBlockHash = SHA256(JSON.stringify(block)).toString();

    if (blockHash === validBlockHash) {
        return true;
      } else {
        console.log(`Block #${blockHeight} invalid hash: ${blockHash} <> ${validBlockHash}`);
        return false;
      }
  }

  /**
   * Criteria: Modify the validateChain() function to validate blockchain stored within levelDB.
   */
  async validateChain() {
    let errorLog = []
    let previousHash = ''
    let block = ''
    let isValidBlock = false

    db.createReadStream().on('data', (data) => {
      block = JSON.parse(data.value)

      isValidBlock = this.validateBlock(block.height)

      if (!isValidBlock) {
        errorLog.push(data.key)
      } 

      if (block.previousBlockHash !== previousHash) {
        errorLog.push(data.key)
      }

      previousHash = block.hash
    }).on('error', (error) => {
      console.log("Error on validateChain")
    }).on('close', () => {
      if (errorLog.length > 0) {
        console.log(`Block errors = ${errorLog.length}`)
        console.log(`Blocks: ${errorLog}`)
      } else {
        console.log('No errors detected')
      }
    })
  }

  // Level db functions

  addBlockToDB(key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (error) => {
        if (error) {
          reject(error)
        }

        console.log(`Added block #${key}`)
        resolve(`Added block #${key}`)
      })
    })
  }

  getBlockFromDB(key) {
    return new Promise((resolve, reject) => {
      db.get(key, (error, value) => {
        if (error) {
          reject(error)
        }

        resolve(value)
      })
    })
  }

  getBlockHeightFromDB() {
    return new Promise((resolve, reject) => {
      let height = -1

      db.createReadStream().on('data', (data) => {
        height++
      }).on('error', (error) => {
        reject(error)
      }).on('close', () => {
        resolve(height)
      })
    })
  }
}

let blockchain = new Blockchain();

(function theLoop (i) {
  setTimeout(() => {
    blockchain.addBlock(new Block(`Test data ${i}`)).then(() => {
      if (--i) {
        theLoop(i)
      }
    })
  }, 100);
})(10);

setTimeout(() => blockchain.validateChain(), 2000)
