const test = require('ava')
const supertest = require('supertest')
const BASE_URL = 'http://localhost:8000'

test.before('Must specify BASE_URL', t => {
  t.truthy(BASE_URL)
})

const app = require('../index')

test.cb('1. /block: should return the new block added', (t) => {
  supertest(BASE_URL)
    .post('/block')
    .send({body: 'This is a test'})
    .expect(201)
    .expect((response) => {
      t.hasOwnProperty('hash')
      t.hasOwnProperty('height')
      t.hasOwnProperty('body')
      t.hasOwnProperty('time')
      t.hasOwnProperty('previousBlockHash')
    })
    .end(t.end)
})

test.cb('2. /block/height: should return the block by height', (t) => {
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
  }, 1000)
})
