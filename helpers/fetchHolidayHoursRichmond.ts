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

  // Minoru will also list Seniors Centre times, which we must filter out
  const foundSeniorCentreIdx = poolAccordionSections.findIndex((s) =>
    s.includes('Seniors Centre'),
  )
  if (foundSeniorCentreIdx >= 3) {
    poolAccordionSections.splice(
      foundSeniorCentreIdx,
      poolAccordionSections.length - 1,
    )
  }
  // filter out any values that aren't dates or times
  const filteredSections = poolAccordionSections.filter((s) => {
    return s.split(',').length > 1 || s.split('-').length > 1
  })

  // check if the times are the same (they should be)
  const allTimes = filteredSections.filter((s) => {
    return s.split('-').length > 1
  })
  const firstTime = allTimes[0]
  const areAllTimesEqual = allTimes.every((t) => t === firstTime)
  // if they AREN'T EQUAL, we have a problem... send a notice: dates may be wrong, check the website
  // in fact, i need that notice in general for all web scrapers
  const allDates = filteredSections.filter((s) => {
    return s.split(',').length > 1
  })

  const datesAndTimesTogetherAtLast: { [date: string]: string } = {}
  allDates.forEach((d) => {
    datesAndTimesTogetherAtLast[d] = firstTime
  })

  const holidayEvents: {
    end_time: string
    start_time: string
    title: string
  }[] = []

  Object.keys(datesAndTimesTogetherAtLast).forEach((date) => {
    const timeRange = datesAndTimesTogetherAtLast[date]
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
