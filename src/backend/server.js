const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 1270

const createScreenshot = require('./createScreenshot')

app.use(express.static(path.join(__dirname, '..', '..', 'dist')))

app.listen(port, () => {
  console.log('Example app listening on port http://localhost:' + port)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
})

app.post('/get-image', async (req, res) => {
  const screenshot = await createScreenshot({
    lang: 'en',
    width: 1100,
    theme: 'dark',
    hideCard: 'false',
    hideThread: 'false',
    tweetId: '1355138534777245697'
  })
  res.send(screenshot)
})
