import { DateTime } from 'luxon'
import { request } from 'undici'
import * as cheerio from 'cheerio'
import { getStartAndEndTimes } from './fetchPoolSchedulesRichmond.js'

export default async function fetchHolidayHoursRichmond(poolName: string) {
  const holidayNoticesUrl =
    'https://www.richmond.ca/parks-recreation/registration/notice.htm'
  const { body } = await request(holidayNoticesUrl)
  const html = await body.text()
  const $ = cheerio.load(html)

  const stringToFind =
    poolName === 'Minoru' ? 'Minoru Centre for Active Living' : 'Watermania'

  const poolAccordionSections = $('h2.showhide')
    .filter((_, el) => $(el).text().trim() === stringToFind)
    .first()
    .next('div')
    .text()
    .trim()
    .split('\n')
    .filter((t) => t.length > 0)

  const datesAndTimes: string[] = []
  if (poolAccordionSections.length > 2) {
    let foundIt = false
    poolAccordionSections.forEach((s) => {
      if (foundIt) {
        datesAndTimes.push(s)
      }
      if (s.includes('Aquatics')) {
        foundIt = true
      }
      if (s.includes('Seniors')) {
        foundIt = false
        datesAndTimes.pop()
      }
    })
  } else {
    datesAndTimes.push(...poolAccordionSections)
  }

  const datesAndTimeRanges: { [date: string]: string } = {}

  const holidayEvents: {
    end_time: string
    start_time: string
    title: string
  }[] = []

  datesAndTimes.forEach((dOrT, i) => {
    if (!dOrT.includes('-')) {
      datesAndTimeRanges[dOrT] = datesAndTimes[i + 1]
    }
  })

  Object.keys(datesAndTimeRanges).forEach((date) => {
    const timeRange = datesAndTimeRanges[date]
    const dateFormattedToLocalizedNumericDate = DateTime.fromFormat(
      date,
      'ccc, LLL d',
    ).toFormat('D')
    const { start_time, end_time } = getStartAndEndTimes(
      dateFormattedToLocalizedNumericDate,
      timeRange,
    )
    if (start_time && end_time) {
      holidayEvents.push({
        start_time,
        end_time,
        title: 'Public Swim',
      })
    }
  })

  return holidayEvents
}
