const test = require('ava')
const supertest = require('supertest')
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')
const fs = require('fs');
const BASE_URL = 'http://localhost:8000'

test.before('Must specify BASE_URL', t => {
  t.truthy(BASE_URL)
})

const app = require('../index')

const keyPair = bitcoin.ECPair.makeRandom()
const privateKey = keyPair.d.toBuffer(32)
const address = keyPair.getAddress()

test.cb('1. /requestValidation: should return a message with validation window', (t) => {
  supertest(BASE_URL)
    .post('/requestValidation')
    .send({address: address})
    .expect(200)
    .expect((response) => {
      t.is(response.status, 200)
      t.is(response.body.address, address)
      t.is(response.body.validationWindow, 300)
      t.hasOwnProperty('timestamp')
      t.hasOwnProperty('message')

      const message = response.body.message
      const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')
      console.log(`Signature: ${signature}`)
      console.log(`Is valid: ${bitcoinMessage.verify(message, address, signature)}`)

      fs.writeFileSync('./data/signature.txt', signature)
    })
    .end(t.end)
})

test.cb('2. /message-signature/validate: should return a valid register star request', (t) => {
  setTimeout(() => {
    const signature = fs.readFileSync('./data/signature.txt').toString() 

    console.log(`Address: ${address}`)
    console.log(`Signature: ${signature}`)
  
    supertest(BASE_URL)
      .post('/message-signature/validate')
      .send({address: address, signature: signature})
      .expect(200)
      .expect((response) => {
        t.is(response.body.registerStar, true)
        t.hasOwnProperty('status')
      })
      .end(t.end)
  }, 1000)
})

test.cb('3. /block: should return the new block added', (t) => {
  setTimeout(() => {
    supertest(BASE_URL)
      .post('/block')
      .send({
        address: address, 
        star: {
          dec: "-26° 29' 24.9", 
          ra: "16h 29m 1.0s", 
          story: `Test story of address ${address}`}
        }
      )
      .expect(201)
      .expect((response) => {
        t.hasOwnProperty('hash')
        t.hasOwnProperty('height')
        t.hasOwnProperty('body')
        t.hasOwnProperty('time')
        t.hasOwnProperty('previousBlockHash')

        fs.writeFileSync('./data/hash.txt', response.body.hash)
      })
      .end(t.end)
  }, 2000)
})

test.cb('4. /block/height: should return the block by height', (t) => {
  setTimeout(() => {
    supertest(BASE_URL)
      .get('/block/1')
      .expect(200)
      .expect((response) => {
        t.hasOwnProperty('hash')
        t.hasOwnProperty('height')
        t.hasOwnProperty('body')
        t.hasOwnProperty('time')
        t.hasOwnProperty('previousBlockHash')
      })
      .end(t.end)
  }, 3000)
})

test.cb('5. /stars/hash:hash: should return the block by hash', (t) => {
  setTimeout(() => {
    const hash = fs.readFileSync('./data/hash.txt').toString() 

    supertest(BASE_URL)
      .get(`/stars/hash:${hash}`)
      .expect(200)
      .expect((response) => {
        t.hasOwnProperty('hash')
        t.hasOwnProperty('height')
        t.hasOwnProperty('body')
        t.hasOwnProperty('time')
        t.hasOwnProperty('previousBlockHash')
      })
      .end(t.end)
  }, 3000)
})

test.cb('6. /stars/address:address: should return the block by address', (t) => {
  setTimeout(() => {
    supertest(BASE_URL)
      .get(`/stars/address:${address}`)
      .expect(200)
      .expect((response) => {
        t.hasOwnProperty('hash')
        t.hasOwnProperty('height')
        t.hasOwnProperty('body')
        t.hasOwnProperty('time')
        t.hasOwnProperty('previousBlockHash')
      })
      .end(t.end)
  }, 3000)
})