# 0xecho/core

## Install

```
// cdn(recommended)
https://cdn.jsdelivr.net/npm/@0xecho/core/dist/index.min.js

// npm
npm install @0xecho/core

// yarn
yarn add @0xecho/core
```

## Usage


``` js
const echo = new EchoCore({
  node: 'https://sandbox.0xecho.com', // will use production node: https://node1.0xecho.com if not specified
  // loginAddress: '0x', you can force user to choose specified ethereum address for ECHO authorization
})

const isAuthorized = echo.isAuthorized() // check if user has login
const authorizedInfo = echo.getAuthorizedInfo()
console.log(isAuthorized, authorizedInfo)

// force user to authorize if needed
// await echo.authorize() 

// send a voting post
// will return 403 if user votes more than once for the same target_uri
try {
  const voteRs = await echo.post({
    type: 'vote',
    sub_type: 'single-choice', // only single-choice is supported now
    target_uri: 'test',
    content: '0',
    meta: {
      title: 'vote',
      body: 'body', // not required
      choices: [
        'hello',
        'world'
      ]
    }
  })
  console.log(voteRs)
} catch (e) {
  console.log(e)
}

// send a comment
try {
  const comment = await echo.post({
    type: 'comment',
    target_uri: 'test',
    content: 'hello'
  })
  console.log(comment)
} catch (e) {
  console.log(e)
}

// get posts
try {
  const rs = await echo.getPosts({
    type: 'vote',
    target_uri: 'test',
    created_by: 'EVM/0x3c98b726cd9e9f20becafd05a9affecd61617c0b' // EVM/ prefix is required for ethereum address
  })
  console.log('voting list', rs)
} catch (e) {
  console.log(e)
}
```