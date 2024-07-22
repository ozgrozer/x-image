const fs = require('fs')
const path = require('path')
const https = require('https')

const icomoonUrl = 'https://i.icomoon.io/public/temp/b54736cb75/x-image/style.css'
const localPath = path.join(__dirname, '..', 'styles', 'icomoon')

const readUrl = url => {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        resolve(data)
      })
    })
  })
}

const downloadFile = (url, outputName) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(localPath, outputName))
    https.get(url, res => {
      res.pipe(file)
    })
  })
}

const writeFile = (filename, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(localPath, filename), content, err => {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
}

const deleteFileSync = filePath => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath, err => {
      if (err) return err
      return true
    })
  }
}

const deleteOldFiles = () => {
  deleteFileSync(path.join(localPath, 'icomoon.css'))
  fs.readdir(localPath, (err, files) => {
    if (err) throw err
    for (const file of files) {
      deleteFileSync(path.join(localPath, file))
    }
  })
}

deleteOldFiles()

readUrl(icomoonUrl).then(res => {
  const icomoonUrlWithoutCss = icomoonUrl.substr(0, icomoonUrl.length - 9)

  const findThis = icomoonUrlWithoutCss
  const replaceIt = new RegExp(findThis, 'g')
  const newCss = res.replace(replaceIt, '')

  writeFile('icomoon.css', newCss)

  downloadFile(icomoonUrlWithoutCss + 'icomoon.eot', 'icomoon.eot')
  downloadFile(icomoonUrlWithoutCss + 'icomoon.ttf', 'icomoon.ttf')
  downloadFile(icomoonUrlWithoutCss + 'icomoon.woff', 'icomoon.woff')
  downloadFile(icomoonUrlWithoutCss + 'icomoon.svg', 'icomoon.svg')
})
