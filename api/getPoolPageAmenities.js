import { request } from 'undici'
import * as cheerio from 'cheerio'

export default async function getPoolPageAmenities(poolUrl) {
  const { body } = await request(poolUrl)
  const html = await body.text()
  const $ = cheerio.load(html)

  const amenitiesH2 = $('h2:contains("Pool amenities")').first()
  const listUnderH2 = amenitiesH2
    .closest('a')
    .next('div')
    .find('ul')
    .first()
    .find('li')
    .map((i, e) => $(e).text().trim())
    .get()
  const listUnderA = amenitiesH2
    .nextAll('ul')
    .first()
    .find('li')
    .map((i, e) => $(e).text().trim())
    .get()

  if (listUnderA.length) {
    return listUnderA
  }
  if (listUnderH2.length) {
    return listUnderH2
  }
  return []
}
