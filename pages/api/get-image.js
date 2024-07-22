import puppeteer from 'puppeteer'
import puppeteerCore from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

export default async (req, res) => {
  try {
    const { xUrl, width, theme, padding, hideCard, hideThread } = req.body

    const lang = 'en'
    const splitUrl = xUrl.split('/')
    const lastItem = splitUrl[splitUrl.length - 1]
    const splitLastItem = lastItem.split('?')
    const xPostId = splitLastItem[0]

    let browser
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
    await page.goto(`https://platform.twitter.com/embed/index.html?dnt=true&embedId=twitter-widget-0&frame=false&hideCard=${hideCard}&hideThread=${hideThread}&id=${xPostId}&lang=${lang}&theme=${theme}&widgetsVersion=ed20a2b%3A1601588405575`, { waitUntil: 'networkidle2' })
    console.log(`https://platform.twitter.com/embed/index.html?dnt=true&embedId=twitter-widget-0&frame=false&hideCard=${hideCard}&hideThread=${hideThread}&id=${xPostId}&lang=${lang}&theme=${theme}&widgetsVersion=ed20a2b%3A1601588405575`)

    const embedDefaultWidth = 550
    const percent = width / embedDefaultWidth
    const pageWidth = embedDefaultWidth * percent
    const pageHeight = 100
    await page.setViewport({ width: pageWidth, height: pageHeight })

    await page.evaluate(
      (props) => {
        const { theme, padding, percent } = props

        const style = document.createElement('style')
        style.innerHTML =
          "* { font-family: -apple-system, BlinkMacSystemFont, Ubuntu, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' !important; }"
        document.getElementsByTagName('head')[0].appendChild(style)

        const body = document.querySelector('body')
        if (body) {
          body.style.padding = `${padding}px`
          body.style.backgroundColor = theme === 'dark' ? '#000' : '#fff'
          body.style.zoom = `${100 * percent}%`
        }

        const innerDiv = document.querySelector('#app > div > div > div')
        if (innerDiv) {
          innerDiv.style.border = 'none'
        } else {
          console.warn('Element #app > div not found')
        }

        const copyLinkToPostButton = document.querySelector('.css-18t94o4.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1wbh5a2.r-1ny4l3l.r-o7ynqc.r-6416eg')
        if (copyLinkToPostButton) {
          copyLinkToPostButton.style.display = 'none'
        }
      },
      { theme, padding, percent }
    )

    await page.waitForNetworkIdle({ idleTime: 500 })

    const imageBuffer = await page.screenshot({
      type: 'png',
      fullPage: true,
      encoding: 'base64'
    })

    if (process.env.VERCEL_ENV !== 'production') {
      await browser.close()
    }

    res.json({ data: imageBuffer })
  } catch (err) {
    console.log(err)
    res.json({ error: err.message })
  }
}
