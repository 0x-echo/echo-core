# ECHO/core

## Install

```
https://cdn.jsdelivr.net/npm/@0xecho/core/dist/index.min.js
```

## Usage

``` js
const echo = new EchoCore({
  node: 'https://sandbox.0xecho.com', // will use production node: https://node1.0xecho.com if not specified
  // loginAddress: '0x', you can force specified address for ECHO authorization
})

// send a voting post
// will return 403 if user voted more than once
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
    created_by: 'EVM/0x3c98b726cd9e9f20becafd05a9affecd61617c0b'
  })
  console.log('voting list', rs)
} catch (e) {
  console.log(e)
}
```