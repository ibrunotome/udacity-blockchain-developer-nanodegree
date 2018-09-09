const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Block = require('./block')
const Blockchain = require('./blockchain')
const chain = new Blockchain()
const StarValidation = require('./star-validation')

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
  const starValidation = new StarValidation(req)

  try {
    starValidation.validateAddressParameter()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error
    })

    return
  }

  const address = req.body.address
  const timestamp = Date.now()
  const message = `${address}:${timestamp}:starRegistry`
  const validationWindow = 300

  const data = {
    "address": address,
    "message": message,
    "timestamp": timestamp,
    "validationWindow": validationWindow
  }

  starValidation.addAddress(data)

  res.json(data)
})

/**
 * Criteria: Web API post endpoint validates message signature with JSON response.
 */
app.post('/message-signature/validate', async (req, res) => {
  const starValidation = new StarValidation(req)

  try {
    starValidation.validateAddressAndSignatureParameters()  
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error
    })

    return
  }

  try {
    const { address, signature } = req.body
    const response = await starValidation.validateMessageSignature(address, signature)

    res.json(response)
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: error
    })
  }
})

/**
 * Criteria: Get star block by star block height with JSON response.
 */
app.get('/block/:height', async (req, res) => {
  try {
    const response = await chain.getBlock(req.params.height)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Block not found'
    })
  }
})

/**
 * Criteria: Get star block by wallet address (blockchain identity) with JSON response.
 */
app.get('/stars/address:address', async (req, res) => {
  try {
    const address = req.params.address.slice(1)
    const response = await chain.getBlocksByAddress(address)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Block not found'
    })
  }
})

/**
 * Criteria: Get star block by hash with JSON response.
 */
app.get('/stars/hash:hash', async (req, res) => {
  try {
    const hash = req.params.hash.slice(1)
    const response = await chain.getBlockByHash(hash)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Block not found'
    })
  }
})

/**
 * Criteria: Star registration Endpoint
 */
app.post('/block', async (req, res) => {
  const starValidation = new StarValidation(req)

  try {
    starValidation.validateNewStarRequest()
    const isValid = await starValidation.isValid()

    if (!isValid) {
      throw 'Signature is not valid or timestamp expired'
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error
    })

    return
  }

  const body = { address, star } = req.body
  const story = star.story

  body.star.story = new Buffer(story).toString('hex')

  await chain.addBlock(new Block(body))
  const height = await chain.getBlockHeight()
  const response = await chain.getBlock(height)

  res.send(response)
})
