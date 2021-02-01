const fs = require('fs')
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

  const splitTweetUrl = tweetUrl.split('/')
  const lastItem = splitTweetUrl[splitTweetUrl.length - 1]
  const splitLastItem = lastItem.split('?')
  const tweetId = splitLastItem[0]

  const tweetsTxtPath = path.join(__dirname, '..', '..', 'tweets.txt')
  const unixtime = Math.round(+new Date() / 1000)
  const dataToSave = `${tweetUrl} ${unixtime}\n`
  fs.appendFile(tweetsTxtPath, dataToSave, err => {
    if (err) throw err
  })

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
