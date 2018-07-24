const SHA256 = require('crypto-js/sha256')

/**
 * Criteria: Configure simpleChain.js with levelDB to persist blockchain dataset using the level Node.js library.
 */
const level = require('level')
const chainDB = './chaindata'
const db = level(chainDB)

class Block {
  constructor (data) {
    this.hash = '',
    this.height = 0,
    this.body = data,
    this.time = 0,
    this.previousBlockHash = ''
  }
}

class Blockchain {
  constructor() {}

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
      const prevBlock = await this.getBlockFromDB(height)
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
    return this.getBlockHeightFromDB()
  }

  /**
   * Criteria: Modify getBlock() function to retrieve a block by it's block heigh within the LevelDB chain.
   * 
   * @param {int} blockHeight 
   */
  async getBlock(blockHeight) {
    const block = await this.getBlockFromDB(blockHeight)
    return JSON.parse(block)
  }

  // Level db functions

  addBlockToDB(key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (error) => {
        if (error) {
          reject(error)
        }

        if (key === 0) {
          console.log('Added block #0 (Genesis block)')
        } else {
          console.log(`Added block #${key}`)
        }

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

        resolve(JSON.parse(value))
      })
    })
  }

  getBlockHeightFromDB() {
    return new Promise((resolve, reject) => {
      let height = -1

      db.createReadStream().on('data', (data) => {
        height++
      }).on('error', (err) => {
        reject(err)
      }).on('close', () => {
        resolve(height)
      })
    })
  }
}

let blockchain = new Blockchain()

setInterval(() => blockchain.addBlock(new Block('test data 1')), 1000)
