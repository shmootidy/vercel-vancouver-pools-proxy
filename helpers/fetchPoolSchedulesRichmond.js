import { request } from 'undici'
import * as cheerio from 'cheerio'
// i guess i'll have to build this out to get the generic schedule and different alerts?
export default async function fetchPoolSchedulesRichmond() {
  const watermania =
    'https://www.richmond.ca/parks-recreation/centres/watermania.htm'
  const minoru = 'https://minorucentre.ca/fees-schedule/'
  const holidayNotices =
    'https://www.richmond.ca/parks-recreation/registration/notice.htm'
  const minoruUpdates = 'https://minorucentre.ca/'
  const minoruAmenities = 'https://minorucentre.ca/swimming-pools/'
  // 'https://www.richmond.ca/parks-recreation/centres/minoru.htm?PageMode=HTML'

  const richmondPoolUrls = {
    Minoru:
      'https://www.richmond.ca/parks-recreation/centres/minoru.htm?PageMode=HTML',
    Watermania:
      'https://www.richmond.ca/parks-recreation/centres/watermania.htm',
  }

  const richmondPoolSchedules = await Promise.all(
    Object.keys(richmondPoolUrls).map(async (poolName) => {
      const url = richmondPoolUrls[poolName]
      const { body } = await request(url)
      const html = await body.text()
      const $ = cheerio.load(html)
      const facilityHoursH3 = $('h3:contains("Facility Hours")').first()
      const section = facilityHoursH3
        .nextAll('section:contains("Regular Hours")')
        .first()
      const scheduleUnderH3 = {}
      section.next('p').each((_, p) => {
        $(p)
          .find('strong')
          .each((_, elm) => {
            const key = $(elm).text().replace(':', '').trim() // Remove the colon
            const value =
              $(elm).next()[0]?.nodeType === 3
                ? $(elm).next().text().trim() // Get the text node after <strong>
                : $(elm).next('br').get(0)
                ? $(elm).get(0).nextSibling.nodeValue.trim() // Handle cases where it's a direct text node
                : '' // Fallback if no match found

            if (key && value) {
              scheduleUnderH3[key] = value
            }
          })
      })
      // i want to change this to be closer in shape to the vancouver calendar:
      /**
       * center_name: Minoru
       * events:
       * * end_time: string
       * * start_time
       * * title
       */
      return { [poolName]: scheduleUnderH3 }
    }),
  )
  return richmondPoolSchedules
}
