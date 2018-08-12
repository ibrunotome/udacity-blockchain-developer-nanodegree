const express = require('express')
const app = express()
const bodyParser = require('body-parser');

/**
 * Criteria: Configure private blockchain project to include a RESTful API with Node.js framework running on port 8000.
 */
const Block = require('./block')
const Blockchain = require('./blockchain')
app.listen(8000, () => console.log('API listening on port 8000'))

app.use(bodyParser.json()); 

app.get('/', (req, res) => res.send('Accepted endpoints: POST /block or GET /block/{BLOCK_HEIGHT}'))

/**
 * Criteria: GET Block endpoint using URL path with block height parameter. Preferred URL path http://localhost:8000/block/{BLOCK_HEIGHT}
 */
app.get('/block/:height', async (req, res) => {
    const blockchain = new Blockchain()

    try {
        const response = await blockchain.getBlock(req.params.height)

        res.send(response);
    } catch(error) {
        res.status(404).json({"status": 404, "message": "Block not found"})
    }
})

/**
 * Criteria: POST Block endpoint using key/value pair within request body. Preferred URL path http://localhost:8000/block
 */
app.post('/block', async (req, res) => {
    const blockchain = new Blockchain()

    if (req.body.body === ''|| req.body.body === undefined) {
        res.status(400).json({"status": 400, message: "Fill the body parameter"})
    }

    setTimeout(() => {
        blockchain.addBlock(new Block(req.body.body)).then(() => {
            blockchain.getBlockHeight().then((height) => {
                blockchain.getBlock(height).then((response) => {
                    res.send(response)
                })
            })
        })
      }, 100);
})