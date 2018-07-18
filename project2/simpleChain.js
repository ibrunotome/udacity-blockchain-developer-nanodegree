/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256')
const level = require('level')
const chainDB = './chaindata'
const db = level(chainDB)

/* ===== DB Class =================================
|  Class with the DB functions         			       |
|  ===============================================*/
class ORM {
  constructor() {
    this.blockHeight = this.getBlockHeight()
  }

  // Add data to levelDB with value
  addBlock(value) {
    let i = 0

    db.createReadStream().on('data', function(data) {
      i++
    }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
    }).on('close', function() {
      console.log(`Block # ${i}`)
      
      db.put(i, value, function(err) {
        if (err) {
          return console.log(`Block ${i} submission failed`, err)
        }
      })
    })
  }

  // Get number of records on DB
  getBlockHeight() {
    let i = 0

    db.createReadStream().on('data', function(data) {
      i++
    }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
    }).on('close', function() {
      return i;
    })
  }

  // Get data from levelDB with key
  getBlock(key) {
    db.get(key, function(err, value) {
      if (err) {
        return console.log('Not found!', err)
      }

      console.log(`Value = ${value}`)
    })
  }
}

/* ===== Block Class ==============================
|  Class with a constructor for block 			       |
|  ===============================================*/

class Block {
	constructor(data) {
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {
    this.orm = new ORM()

    if (this.orm.blockHeight === 0) {
      this.addBlock(new Block("First block in the chain - Genesis block"))
    }
  }

  // Add new block
  addBlock(newBlock) {
    // previous block hash
    if (this.orm.blockHeight > 0) {
      // Block height
      newBlock.height = this.orm.blockHeight + 1
      newBlock.previousBlockHash = this.orm.getBlock(this.orm.blockHeight).hash
    }

    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0, -3)

    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()

    // Adding block object to chain
    this.orm.addBlock(newBlock)

    // Update block height
    this.orm.blockHeight = this.orm.getBlockHeight()
  }

  // get block
  getBlock(blockHeight) {
    // return object as a single string
    return JSON.parse(JSON.stringify(this.chain[blockHeight]))
  }

  // validate block
  validateBlock(blockHeight) {
    // get block object
    let block = this.getBlock(blockHeight)

    // get block hash
    let blockHash = block.hash

    // remove block hash to test block integrity
    block.hash = ''

    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString()

    // Compare
    if (blockHash === validBlockHash) {
        return true
    } else {
      console.log(`Block #${blockHeight} invalid hash:
      ${blockHash} <> ${validBlockHash}`)

      return false
    }
  }

  // Validate blockchain
  validateChain() {
    let errorLog = []

    for (let i = 0; i < this.chain.length - 1; i++) {
      // validate block
      if (!this.validateBlock(i)) {
          errorLog.push(i)
      }

      // compare blocks hash link
      let blockHash = this.chain[i].hash
      let previousHash = this.chain[i + 1].previousBlockHash

      if (blockHash !== previousHash) {
        errorLog.push(i)
      }
    }

    if (errorLog.length > 0) {
      console.log(`Block errors = ${errorLog.length}`)
      console.log(`Blocks: ${errorLog}`)
    } else {
      console.log('No errors detected')
    }
  }
}
