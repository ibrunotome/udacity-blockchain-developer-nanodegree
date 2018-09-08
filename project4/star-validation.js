class StarValidation {
  constructor (req) {
    this.req = req
    this.dec = req.body.star.dec,
    this.ra = req.body.star.ra,
    this.story = req.body.star.story
  }

  validateNewStarRequest() {
    if (!this.req.body.address || !this.req.body.star) {
      throw 'Fill the address and star parameters'
    }

    // Validate ra, dec, story 
    if (typeof this.dec !== 'string' || typeof this.ra !== 'string' || typeof this.story !== 'string' || !this.dec.length || !this.ra.length || !this.story.length) {
      throw "Your star information should include non-empty string properties 'dec', 'ra' and 'story'"
    }

    // Validate if story length less than 500 bytes
    if (new Buffer(this.story).length > 500) {
      throw 'Your star story too is long. Maximum size is 500 bytes'
    }

    // Check if string contains only ASCII symbols (0-126 char codes)
    const isASCII = ((str) =>  /^[\x00-\x7F]*$/.test(str))

    if (!isASCII(this.story)) {
      throw 'Your star story contains non-ASCII symbols'
    }
  }

  /**
   * Check whether wallet address is authorized for register a new star 
   */
  validateAuthorization(db) {
    return db.get(this.req.body.address)
      .then((value) => {
        value = JSON.parse(value)
        const nowSubFiveMinutes = Date.now() - (5 * 60 * 1000)
        const isExpired = value.timestamp < nowSubFiveMinutes

        return !isExpired && value.messageSignature === 'valid'
      })
      .catch(() => {throw 'Not authorized'})
  }
}
  
module.exports = StarValidation