const express = require('express')
const app = express()

/**
 * Criteria: Configure private blockchain project to include a RESTful API with Node.js framework running on port 8000.
 */
const Blockchain = require('./blockchain')
app.listen(8000, () => console.log('API listening on port 8000'))

app.get('/', (req, res) => res.send('Accepted endpoints: POST /block or GET /block/{BLOCK_HEIGHT}'))

/**
 * Criteria: GET Block endpoint using URL path with block height parameter. Preferred URL path http://localhost:8000/block/{BLOCK_HEIGHT}
 */
app.get('/block/:height', async (req, res) => {
    const blockchain = new Blockchain();
    const response = await blockchain.getBlock(req.params.height)

    res.send(response);
})