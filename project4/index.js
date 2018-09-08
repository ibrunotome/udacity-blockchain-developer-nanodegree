/**
 * Criteria: Configure private blockchain project to include a RESTful API with Node.js framework running on port 8000.
 */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Block = require('./block')
const Blockchain = require('./blockchain')
const chain = new Blockchain()

app.listen(8000, () => console.log('API listening on port 8000'))
app.use(bodyParser.json())
app.get('/', (req, res) => res.status(404).json({
  "status": 404,
  "message": "Check the README.md for the accepted endpoints"
}))

app.post('/requestValidation', async (req, res) => {
  const address = req.body.address
  const timestamp = new Date()
    .getTime()
    .toString()
    .slice(0, -3)

  const message = `${address}:${timestamp}:starRegistry`
  const validationWindow = 300

  res.json({
    message,
    timestamp,
    validationWindow
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
  if (req.body.body === '' || req.body.body === undefined) {
    res.status(400).json({
      "status": 400,
      message: "Fill the body parameter"
    })
  }

  await chain.addBlock(new Block(req.body.body))
  const height = await chain.getBlockHeight()
  const response = await chain.getBlock(height)

  res.send(response)
})
