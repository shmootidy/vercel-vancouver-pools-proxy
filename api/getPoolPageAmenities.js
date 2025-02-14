import { request } from 'undici'
import * as cheerio from 'cheerio'

export default async function getPoolPageAlerts(poolUrl) {
  const { body } = await request(poolUrl)
  const html = await body.text()
  const $ = cheerio.load(html)

  // incomplete
  const siteAlerts = $('[id^="siteAlert"]')
  const siteAlertContents = []
  siteAlerts.each((idx, elm) => {
    const contents = $(elm).text()
    siteAlertContents.push(contents)
  })

  const isAnnualMaintenance = siteAlertContents.find((c) =>
    c.includes('annual maintenance')
  )

  return isAnnualMaintenance ? 'annual maintenance' : siteAlertContents.join('')
}
