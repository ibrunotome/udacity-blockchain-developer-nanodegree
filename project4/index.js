/**
 * Criteria: Configure private blockchain project to include a RESTful API with Node.js framework running on port 8000.
 */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Block = require('./block')
const Blockchain = require('./blockchain')
const chain = new Blockchain()
const level = require('level')
const chainDB = './data/star'
const db = level(chainDB)
const bitcoinMessage = require('bitcoinjs-message')

app.listen(8000, () => console.log('API listening on port 8000'))
app.use(bodyParser.json())
app.get('/', (req, res) => res.status(404).json({
  "status": 404,
  "message": "Check the README.md for the accepted endpoints"
}))

/**
 * Criteria: Web API post endpoint validates request with JSON response.
 */
app.post('/requestValidation', async (req, res) => {
  if (!req.body.address) {
    res.status(400).json({
      "status": 400,
      message: "Fill the address parameter"
    })
  }

  const address = req.body.address
  const timestamp = Date.now()

  const message = `${address}:${timestamp}:starRegistry`
  const validationWindow = 300

  const response = {
    "address": address,
    "message": message,
    "timestamp": timestamp,
    "validationWindow": validationWindow
  }

  db.put(address, JSON.stringify(response))

  res.json(response)
})

/**
 * Criteria: Web API post endpoint validates message signature with JSON response.
 */
app.post('/message-signature/validate', async (req, res) => {
  if (!req.body.address || !req.body.signature) {
    res.status(400).json({
      "status": 400,
      message: "Fill the address and signature parameters"
    })
  }

  const { address, signature } = req.body

  db.get(address)
    .then((value) => {
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

        res.json({
            registerStar: !isExpired && isValid,
            status: value
        })
    })
})

/**
 * Criteria: GET Block endpoint using URL path with block height parameter. Preferred URL path http://localhost:8000/block/{BLOCK_HEIGHT}
 */
app.get('/block/:height', async (req, res) => {
  try {
    const response = await chain.getBlock(req.params.height)
    res.send(response)
  } catch (error) {
    res.status(404).json({
      "status": 404,
      "message": "Block not found"
    })
  }
})

/**
 * Criteria: POST Block endpoint using key/value pair within request body. Preferred URL path http://localhost:8000/block
 */
app.post('/block', async (req, res) => {
  if (!req.body.address || !req.body.star) {
    res.status(400).json({
      "status": 400,
      message: "Fill the address and star parameters"
    })
  }

  const body = { address, star } = req.body
  const { dec, ra, story } = star

  // Validate ra, dec, story 
  if (typeof dec !== 'string' || typeof ra !== 'string' || typeof story !== 'string' || !dec.length || !ra.length || !story.length) {
    return res.status(400).json({
        reason: 'Bad request',
        details: "Your star information should include non-empty string properties 'dec', 'ra' and 'story'"
    })
  }

  // Validate if story length less than 500 bytes
  if (new Buffer(story).length > 500) {
    return res.status(400).json({
        reason: 'Bad request',
        details: 'Your star story too is long. Maximum size is 500 bytes'
    })
  }

  // Check if string contains only ASCII symbols (0-126 char codes)
  const isASCII = ((str) =>  /^[\x00-\x7F]*$/.test(str))

  if (!isASCII(story)) {
    return res.status(400).json({
        reason: 'Bad request',
        details: 'Your star story contains non-ASCII symbols'
    })
  }

  body.star.story = new Buffer(story).toString('hex')

  await chain.addBlock(new Block(body))
  const height = await chain.getBlockHeight()
  const response = await chain.getBlock(height)

  res.send(response)
})
