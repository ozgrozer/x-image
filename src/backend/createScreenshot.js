const puppeteer = require('puppeteer')
const puppeteerCore = require('puppeteer-core')
const chromium = require('@sparticuz/chromium')

const createScreenshot = async props => {
  try {
    const { lang, width, theme, padding, hideCard, hideThread, tweetId } = props

    let browser
    console.log('process.env')
    console.log(process.env)
    if (process.env.VERCEL_ENV === 'production') {
      const executablePath = await chromium.executablePath()
      browser = await puppeteerCore.launch({
        executablePath,
        args: chromium.args,
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport
      })
    } else {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    }

    const page = await browser.newPage()
    await page.goto(`https://platform.twitter.com/embed/index.html?dnt=true&embedId=twitter-widget-0&frame=false&hideCard=${hideCard}&hideThread=${hideThread}&id=${tweetId}&lang=${lang}&theme=${theme}&widgetsVersion=ed20a2b%3A1601588405575`, { waitUntil: 'networkidle0' })

    const embedDefaultWidth = 550
    const percent = width / embedDefaultWidth
    const pageWidth = embedDefaultWidth * percent
    const pageHeight = 100
    await page.setViewport({ width: pageWidth, height: pageHeight })

    await page.evaluate(props => {
      const { theme, padding, percent } = props

      const style = document.createElement('style')
      style.innerHTML = "* { font-family: -apple-system, BlinkMacSystemFont, Ubuntu, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' !important; }"
      document.getElementsByTagName('head')[0].appendChild(style)

      const body = document.querySelector('body')
      body.style.padding = `${padding}px`
      body.style.backgroundColor = theme === 'dark' ? '#000' : '#fff'
      body.style.zoom = `${100 * percent}%`
      const articleWrapper = document.querySelector('#app > div')
      articleWrapper.style.border = 'none'
    }, ({ theme, padding, percent }))

    const imageBuffer = await page.screenshot({
      type: 'png',
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
