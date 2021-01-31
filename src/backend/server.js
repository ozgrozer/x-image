const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 1270

const createScreenshot = require('./createScreenshot')

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', '..', 'dist')))

app.listen(port, () => {
  console.log('Example app listening on port http://localhost:' + port)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
})

app.post('/get-image', async (req, res) => {
  const { tweetUrl, width, theme, padding, hideCard, hideThread } = req.body

  const split = tweetUrl.split('/')
  const tweetId = split[split.length - 1]

  const screenshot = await createScreenshot({
    width,
    theme,
    padding,
    tweetId,
    hideCard,
    hideThread,
    lang: 'en'
  })
  res.send(screenshot)
})
