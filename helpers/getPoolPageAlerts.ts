import { request } from 'undici'
import * as cheerio from 'cheerio'

export default async function getPoolPageAlerts(poolUrl: string) {
  const { body } = await request(poolUrl)
  const html = await body.text()
  const $ = cheerio.load(html)

  const siteAlerts = $('[id^="siteAlert"]')
  const siteAlertContents: string[] = []
  siteAlerts.each((_, elm) => {
    const contents = $(elm).text().trim()
    siteAlertContents.push(contents)
  })

  const isAnnualMaintenance = siteAlertContents.find((c) =>
    c.includes('annual maintenance'),
  )

  return isAnnualMaintenance ? 'annual maintenance' : siteAlertContents.join('')
}
