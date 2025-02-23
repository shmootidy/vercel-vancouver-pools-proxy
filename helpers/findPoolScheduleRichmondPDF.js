import { request } from 'undici'
import * as cheerio from 'cheerio'

// this will need to take args, but right now is hardcoded to Minoru
export default async function findPoolScheduleRichmondPDF() {
  const richmondURL = 'https://www.richmond.ca'
  const { body } = await request(
    `${richmondURL}/parks-recreation/about/schedules.htm`,
  )
  const html = await body.text()
  const $ = cheerio.load(html)

  const pdfLinks = $('a')
    .filter((i, el) => $(el).attr('href').includes('__shared/assets'))
    .filter((i, el) => $(el).attr('href').includes('Aquatic'))
    .map((i, el) => $(el).attr('href'))
    .get()
  const firstPdfURL = `${richmondURL}${pdfLinks[0]}`

  return firstPdfURL
}
