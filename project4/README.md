## Project overview

Your web service will provide a few new features to your users. The goal is to allow users to notarize star ownership using their blockchain identity.

## Project specification 

https://review.udacity.com/#!/rubrics/2098/view

---

## Framework used

Express.js

## Getting started

Open a command prompt or shell terminal after install node.js and execute:

```
npm install
```

## Testing

```
npm test
```

## Endpoint description

### 1. Blockchain ID validation request

**Method**

```
POST
```

**Endpoint**

```
http://localhost:8000/requestValidation
```

**Parameters**

```
address - A bitcoin address, you can take it from your project1
```

**Example**

<img src="https://albumizr.com/ia/7a90997f6373e50814c81795fac9883c.jpg">

### 2. Blockchain ID message signature validation

**Method**

```
POST
```

**Endpoint**

```
http://localhost:8000/message-signature/validate
```

**Parameters**

```
address - The addres that you used in last step
signature - You can take it from the Electrum wallet (see below) or make it by code (see test/index.test.js)
```

**Example**

<img src="https://albumizr.com/ia/e68f0fded8e9013405ad534876307329.jpg">
<img src="https://albumizr.com/ia/5354bdcc4c6c930cdce60aa583833252.jpg">

### 3. Star registration

**Method**

```
POST
```

**Endpoint**

```
http://localhost:8000/block
```

**Parameters**

```
address - The addres that you used in last step
star - Containing dec, ra and story (max 500 bytes)
```

**Example**

<img src="https://albumizr.com/ia/33a9881b58354aafeee40a1cc5177f40.jpg">

### 4. Get block by height

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/block/:height
```

**Parameters**

```
height - The height of block
```

**Example**

<img src="https://albumizr.com/ia/f9f60c3e3ccaea83067312a94de2fb15.jpg">

### 6. Get block by address

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/stars/address:address
```

**Parameters**

```
address - The address used so far
```

**Example**

<img src="https://albumizr.com/ia/93618509ebccd55a0186050decdec961.jpg">

### 5. Get block by hash

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/stars/hash:hash
```

**Parameters**

```
hash - The hash of one block created before
```

**Example**

<img src="https://albumizr.com/ia/f4c59f431b1d75e54b5b0acb034a9a75.jpg">

## Udacity honor code

Giving credits for places that helped me to do this project

- Udacity Project4 Concepts section
- Udacity slack of nanodegree
- https://github.com/bitcoinjs/bitcoinjs-message
- https://bitcoin.stackexchange.com/questions/49946/understanding-signing-messages-with-bitcoinjs-lib