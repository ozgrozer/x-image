const path = require('path')
const express = require('express')
const app = express()
const port = 1270

app.use(express.static(path.join(__dirname, '..', '..', 'dist')))

app.listen(port, () => {
  console.log('Example app listening on port http://localhost:' + port)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
})
