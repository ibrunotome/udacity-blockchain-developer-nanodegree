const compression = require('compression')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Block = require('./block')
const Blockchain = require('./blockchain')
const chain = new Blockchain()
const StarValidation = require('./star-validation')

validateAddressParameter = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req)
    starValidation.validateAddressParameter()
    next()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
}

validateSignatureParameter = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req)
    starValidation.validateSignatureParameter()
    next()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
}

validateNewStarRequest = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req)
    starValidation.validateNewStarRequest()
    next()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
}

app.use(compression())
app.listen(8000, () => console.log('API listening on port 8000'))
app.use(bodyParser.json())
app.get('/', (req, res) => res.status(404).json({
  status: 404,
  message: 'Check the README.md for the accepted endpoints'
}))

/**
 * @description Criteria: Web API post endpoint validates request with JSON response.
 */
app.post('/requestValidation', [validateAddressParameter], async (req, res) => {
  const starValidation = new StarValidation(req)
  const address = req.body.address

  try {
    data = await starValidation.getPendingAddressRequest(address)
  } catch (error) {
    data = await starValidation.saveNewRequestValidation(address)
  }

  res.json(data)
})

/**
 * @description Criteria: Web API post endpoint validates message signature with JSON response.
 */
app.post('/message-signature/validate', [validateAddressParameter, validateSignatureParameter], async (req, res) => {
  const starValidation = new StarValidation(req)

  try {
    const { address, signature } = req.body
    const response = await starValidation.validateMessageSignature(address, signature)

    if (response.registerStar) {
      res.json(response)
    } else {
      res.status(401).json(response)
    }
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: error.message
    })
  }
})

/**
 * @description Criteria: Star registration Endpoint
 */
app.post('/block', [validateNewStarRequest], async (req, res) => {
  const starValidation = new StarValidation(req)

  try {
    const isValid = await starValidation.isValid()

    if (!isValid) {
      throw new Error('Signature is not valid')
    }
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: error.message
    })

    return
  }

  const body = { address, star } = req.body
  const story = star.story

  body.star = {
    dec: star.dec,
    ra: star.ra,
    story: new Buffer(story).toString('hex'),
    mag: star.mag,
    con: star.con
  }
  
  await chain.addBlock(new Block(body))
  const height = await chain.getBlockHeight()
  const response = await chain.getBlock(height)

  starValidation.invalidate(address)

  res.status(201).send(response)
})

/**
 * @description Criteria: Get star block by star block height with JSON response.
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
 * @description Criteria: Get star block by wallet address (blockchain identity) with JSON response.
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
 * @description Criteria: Get star block by hash with JSON response.
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
