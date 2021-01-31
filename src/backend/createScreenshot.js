const puppeteer = require('puppeteer')

const createScreenshot = async props => {
  try {
    const { lang, width, theme, hideCard, hideThread, tweetId } = props

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    })
    const page = await browser.newPage()
    await page.goto(`https://platform.twitter.com/embed/index.html?dnt=true&embedId=twitter-widget-0&frame=false&hideCard=${hideCard}&hideThread=${hideThread}&id=${tweetId}&lang=${lang}&theme=${theme}&widgetsVersion=ed20a2b%3A1601588405575`, { waitUntil: 'networkidle0' })

    const embedDefaultWidth = 550
    const percent = width / embedDefaultWidth
    const pageWidth = embedDefaultWidth * percent
    const pageHeight = 100
    await page.setViewport({ width: pageWidth, height: pageHeight })

    const propsForPage = { theme: theme, percent: percent }
    await page.evaluate(props => {
      const { theme, percent } = props
      const body = document.querySelector('body')
      body.style.backgroundColor = theme === 'dark' ? '#000' : '#fff'
      body.style.zoom = `${100 * percent}%`
      const articleWrapper = document.querySelector('#app > div')
      articleWrapper.style.border = 'none'
    }, (propsForPage))

    const imageBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 100,
      fullPage: true,
      encoding: 'base64'
    })

    await browser.close()

    return imageBuffer
  } catch (err) {
    console.log(err)
  }
}

module.exports = createScreenshot
