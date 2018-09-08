const db = require('level')('./data/star')
const bitcoinMessage = require('bitcoinjs-message')

class StarValidation {
  constructor (req) {
    this.req = req
  }

  validateAddressParameter() {
    if (!this.req.body.address) {
      throw 'Fill the address parameter'
    }

    return true
  }

  validateAddressAndSignatureParameters() {
    if (!this.validateAddressParameter() || !this.req.body.signature) {
      throw 'Fill the address and signature parameters'
    }
  }

  validateNewStarRequest() {
    if (!this.validateAddressParameter() || !this.req.body.star) {
      throw 'Fill the address and star parameters'
    }

    // Validate ra, dec, story 
    if (typeof this.req.body.star.dec !== 'string' || typeof this.req.body.star.ra !== 'string' || typeof this.req.body.star.story !== 'string' || !this.req.body.star.dec.length || !this.req.body.star.ra.length || !this.req.body.star.story.length) {
      throw "Your star information should include non-empty string properties 'dec', 'ra' and 'story'"
    }

    // Validate if story length less than 500 bytes
    if (new Buffer(this.req.body.star.story).length > 500) {
      throw 'Your star story too is long. Maximum size is 500 bytes'
    }

    // Check if string contains only ASCII symbols (0-126 char codes)
    const isASCII = ((str) =>  /^[\x00-\x7F]*$/.test(str))

    if (!isASCII(this.req.body.star.story)) {
      throw 'Your star story contains non-ASCII symbols'
    }
  }

  /**
   * Check whether wallet address is authorized for register a new star 
   */
  isValid() {
    return db.get(this.req.body.address)
      .then((value) => {
        value = JSON.parse(value)
        const nowSubFiveMinutes = Date.now() - (5 * 60 * 1000)
        const isExpired = value.timestamp < nowSubFiveMinutes

        return !isExpired && value.messageSignature === 'valid'
      })
      .catch(() => {throw 'Not authorized'})
  }

  addAddress(data) {
    db.put(data.address, JSON.stringify(data))
  }

  async validateMessageSignature(address, signature) {
    return new Promise((resolve, reject) => {
      db.get(address, (error, value) => {
        if (error) {
          reject(error)
        }

        value = JSON.parse(value)

        const nowSubFiveMinutes = Date.now() - (5 * 60 * 1000)
        const isExpired = value.timestamp < nowSubFiveMinutes
        let isValid = false

        if (isExpired) {
            value.validationWindow = 0
            value.messageSignature = 'Validation window was expired'
        } else {
            value.validationWindow = Math.floor((value.timestamp - nowSubFiveMinutes) / 1000) 
            isValid = bitcoinMessage.verify(value.message, address, signature)
            value.messageSignature = isValid ? 'valid' : 'invalid'
        }

        db.put(address, JSON.stringify(value))

        resolve({
            registerStar: !isExpired && isValid,
            status: value
        })
      })
    })
  }
}
  
module.exports = StarValidation