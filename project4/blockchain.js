const SHA256 = require('crypto-js/sha256')
const Block = require('./block')
const db = require('level')('./data/chain')

class Blockchain {
  constructor () {
    this.getBlockHeight().then((height) => {
      if (height === -1) {
        this.addBlock(new Block('Genesis block')).then(() => console.log('Genesis block added!'))
      }
    })
  }

  /**
   * @description Criteria: addBlock(newBlock) function includes a method to store newBlock with LevelDB.
   * @param {Block} newBlock
   */
  async addBlock (newBlock) {
    const height = parseInt(await this.getBlockHeight())

    newBlock.height = height + 1
    newBlock.time = new Date().getTime().toString().slice(0, -3)

    if (newBlock.height > 0) {
      const prevBlock = await this.getBlock(height)
      newBlock.previousBlockHash = prevBlock.hash
    }

    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()

    await this.addBlockToDB(newBlock.height, JSON.stringify(newBlock))
  }

  /**
   * @description Criteria: Modify getBlockHeight() function to retrieve current block height within the LevelDB chain.
   */
  async getBlockHeight () {
    return await this.getBlockHeightFromDB()
  }

  /**
   * @description Criteria: Modify getBlock() function to retrieve a block by it's block heigh within the LevelDB chain.
   * @param {int} blockHeight 
   */
  async getBlock (blockHeight) {
    return await this.getBlockByHeight(blockHeight)
  }

  /**
   * @description Criteria: Modify the validateBlock() function to validate a block stored within levelDB.
   * @param {int} blockHeight 
   */
  async validateBlock (blockHeight) {
    let block = await this.getBlock(blockHeight)
    const blockHash = block.hash
    block.hash = ''
    
    let validBlockHash = SHA256(JSON.stringify(block)).toString()

    if (blockHash === validBlockHash) {
        return true
      } else {
        console.log(`Block #${blockHeight} invalid hash: ${blockHash} <> ${validBlockHash}`)
        return false
      }
  }

  /**
   * @description Criteria: Modify the validateChain() function to validate blockchain stored within levelDB.
   */
  async validateChain () {
    let errorLog = []
    let previousHash = ''
    let isValidBlock = false

    const heigh = await this.getBlockHeightFromDB()

    for (let i = 0; i < heigh; i++) {
      this.getBlock(i).then((block) => {
        isValidBlock = this.validateBlock(block.height)

        if (!isValidBlock) {
          errorLog.push(i)
        } 

        if (block.previousBlockHash !== previousHash) {
          errorLog.push(i)
        }

        previousHash = block.hash

        if (i === (heigh -1)) {
          if (errorLog.length > 0) {
            console.log(`Block errors = ${errorLog.length}`)
            console.log(`Blocks: ${errorLog}`)
          } else {
            console.log('No errors detected')
          }
        }
      })
    }
  }

  async addBlockToDB (key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (error) => {
        if (error) {
          return reject(error)
        }

        return resolve(`Added block #${key}`)
      })
    })
  }

  async getBlockHeightFromDB () {
    return new Promise((resolve, reject) => {
      let height = -1

      db.createReadStream().on('data', (data) => {
        height++
      }).on('error', (error) => {
        return reject(error)
      }).on('close', () => {
        return resolve(height)
      })
    })
  }
  
  async getBlockByHeight (key) {
    return new Promise((resolve, reject) => {
      db.get(key, (error, value) => {
        if (value === undefined) {
          return reject('Not found')
        } else if (error) {
          return reject(error)
        }

        value = JSON.parse(value)

        if (parseInt(key) > 0) {
          value.body.star.storyDecoded = new Buffer(value.body.star.story, 'hex').toString()
        }

        return resolve(value)
      })
    })
  }

  async getBlockByHash (hash) {
    let block

    return new Promise((resolve, reject) => {
      db.createReadStream().on('data', (data) => {    
        block = JSON.parse(data.value)
        
        if (block.hash === hash) {
          if (!this.isGenesis(data.key)) {
            block.body.star.storyDecoded = new Buffer(block.body.star.story, 'hex').toString()
            return resolve(block)
          } else {
            return resolve(block)
          }
        }
      }).on('error', (error) => {
        return reject(error)
      }).on('close', () => {
        return reject('Not found')
      })
    })
  }
  
  async getBlocksByAddress (address) {
    const blocks = []
    let block

    return new Promise((resolve, reject) => {
      db.createReadStream().on('data', (data) => {
        // Don't check the genesis block
        if (!this.isGenesis(data.key)) {
          block = JSON.parse(data.value)

          if (block.body.address === address) {
            block.body.star.storyDecoded = new Buffer(block.body.star.story, 'hex').toString()
            blocks.push(block)
          }
        }
      }).on('error', (error) => {
        return reject(error)
      }).on('close', () => {
        return resolve(blocks)
      })
    })
  }

  isGenesis (key) {
    return parseInt(key) === 0
  }
}

module.exports = Blockchain
