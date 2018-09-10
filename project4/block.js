class Block {
  constructor (data) {
    this.hash = ''
    this.height = 0
    this.body = data
    this.time = 0
    this.previousBlockHash = ''
  }
}

module.exports = Block
