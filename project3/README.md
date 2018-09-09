## Project overview
We solved the challenge to persist our blockchain dataset. Our next challenge is to build a RESTful web API using a Node.js framework that will interface with your private blockchain.

By configuring a web API for your private blockchain you expose functionality that can be consumed by several types of web clients ranging from desktop, mobile, and IoT devices.

## Why this project?
This project introduces you to the fundamentals of web API's with Node.js frameworks.

Using your own private blockchain to create a web API is a huge first step toward developing your own web applications that are consumable by a variety of web clients. Later in this program, you’ll be programming blockchain technologies that utilize these similar features using smart contracts.

## What will I learn?
You will learn to create and manage a web API with a Node.js framework to interact with your private blockchain. You’ll get first hand experience generating API endpoints and configuring the endpoints response that can be consumable by many types of web clients.

This project helps build on the skills you learned in Lesson 1, Lesson 2, and Lesson 3. You will be apply these skills using real world technologies to get hands on with the tools used to create web API's.

## How does this help my career?
Understanding web API's and ways to create them will help you build user applications later in the program. These applications will serve as great portfolio items for potential employers.

## Project specification

https://review.udacity.com/#!/rubrics/1707/view

---

## Framework used

Express.js

## Getting started

Open a command prompt or shell terminal after install node.js and execute:

```
npm install
```

## Testing

Run the server:

```
node index.js
```

Use a software like postman or a simple CURL on the terminal to send the requests to the base url http://localhost:8000 with one of the below supported endpoints:

- GET
/block/{BLOCK_HEIGHT}

example:

```
 curl http://localhost:8000/block/0
```

- POST
/block

example:

```
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"block body contents"}'
```
