import { DateTime } from 'luxon'
import { request } from 'undici'
import * as cheerio from 'cheerio'
import fetchHolidayHoursRichmond from './fetchHolidayHoursRichmond.js'
import { RichmondPoolScheduleArgs } from '../api/app/getRichmondPoolSchedules.js'

export default async function fetchPoolSchedulesRichmond(
  richmondPoolScheduleArgs: RichmondPoolScheduleArgs[],
) {
  const now = DateTime.now().setZone('America/Vancouver')

  const richmondPoolSchedules = await Promise.all(
    richmondPoolScheduleArgs.map(async (arg) => {
      const poolName = arg.poolName
      const holidayEvents = await fetchHolidayHoursRichmond(poolName)

      const { body } = await request(arg.poolUrl)
      const html = await body.text()
      const $ = cheerio.load(html)

      const facilityHoursH3 = $('h3:contains("Facility Hours")').first()
      const section = facilityHoursH3
        .nextAll('section:contains("Regular Hours")')
        .first()

      const poolEvents: {
        end_time: string
        start_time: string
        title: string
      }[] = []

      // get the info we need from the page
      const daySections: string[] = []
      const allText: string[] = []
      section.next('p').each((i, elm) => {
        const strong = $(elm).find('strong').text().trim()
        daySections.push(strong)
        allText.push($(elm).text().trim())
      })

      const daySectionsSplit = daySections[0]
        .split(':')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
      const allTextSplit = allText[0]
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      // group text by day section
      const allTextGroupedByDaySection: { [dayRange: string]: string[] } = {}
      let lastDaySection = ''
      // initialize arrays
      allTextSplit.forEach((t) => {
        const foundDaySection = daySectionsSplit.find((s) => t.includes(s))
        if (foundDaySection) {
          lastDaySection = foundDaySection
        }
        allTextGroupedByDaySection[lastDaySection] = []
      })
      // populate arrays
      allTextSplit.forEach((t) => {
        const foundDaySection = daySectionsSplit.find((s) => t.includes(s))
        let timeRange = t
        if (foundDaySection) {
          lastDaySection = foundDaySection
          // remove the time range from the section here
          timeRange = t.substring(foundDaySection.length + 2)
        }
        // omit irrelevant string
        if (!timeRange.includes('Find up-to-date')) {
          allTextGroupedByDaySection[lastDaySection].push(timeRange)
        }
      })

      Object.keys(allTextGroupedByDaySection).forEach((daySection) => {
        // get the dayIndices of the day section (eg., Mon-Fri = [1,2,3,4,5])
        const dayIndicesOfDaySection = getDayIndicesOfDaySection(daySection)

        // get the actual dates of the upcoming schedule
        dayIndicesOfDaySection.forEach((i) => {
          const eventDay = getEventDay(now, i)
          // get start and end times of the particular day
          // join the day of the event with its start and end times to create the start_time and end_time of the event
          // and push it to the events array
          const timeRangesOfDaySection = allTextGroupedByDaySection[daySection]
          if (timeRangesOfDaySection.length === 1) {
            const eventDescription = 'Public Swim'
            const { start_time, end_time } = getStartAndEndTimes(
              eventDay,
              timeRangesOfDaySection[0],
            )
            if (end_time && start_time) {
              poolEvents.push({ end_time, start_time, title: eventDescription })
            }
          } else {
            timeRangesOfDaySection.forEach((timeRange) => {
              const timeRangeSplitBetweenEventAndTimeRange =
                timeRange.split(': ')
              if (timeRangeSplitBetweenEventAndTimeRange.length <= 1) {
                // really, it's just === 1, but just in case it's a 0, i don't want my app to break
                // again, this is an all day event, but this time i will exclude it, bc of the other segments have the event details
              } else {
                const eventDescription =
                  timeRangeSplitBetweenEventAndTimeRange[0]
                const actualTimeRange =
                  timeRangeSplitBetweenEventAndTimeRange[1]

                const { start_time, end_time } = getStartAndEndTimes(
                  eventDay,
                  actualTimeRange,
                )

                if (end_time && start_time) {
                  poolEvents.push({
                    end_time,
                    start_time,
                    title: eventDescription,
                  })
                }
              }
            })
          }
        })
      })
      return {
        center_name: poolName,
        events: [...poolEvents, ...holidayEvents],
      }
    }),
  )
  return richmondPoolSchedules
}

function getDayIndex(dayStr: string): number | undefined {
  if (DAYS_INDEX[dayStr]) {
    return DAYS_INDEX[dayStr]
  }
}

const DAYS_INDEX: {
  [day: string]: number
} = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
}

function convertTime(eventDay: string, timeString: string): string | null {
  return DateTime.fromFormat(
    `${eventDay} ${timeString.replace(/([apm]{2})$/, ' $1')}`,
    'yyyy-MM-dd t',
  ).toSQL({ includeOffset: false })
}

function getDayIndicesOfDaySection(
  daySection: string, // 'Mon-Fri' | 'Mon-Sat' | 'Sat' | 'Sun' | 'Sun & Holidays',
) {
  const daysIndices: number[] = []
  // Mon-Fri or Mon-Sat
  if (daySection.includes('-')) {
    const daysRange = daySection.split('-')
    const startOfRangeIdx = getDayIndex(daysRange[0])
    const endOfRangeIdx = getDayIndex(daysRange[1])
    if (startOfRangeIdx && endOfRangeIdx) {
      for (let i = startOfRangeIdx; i <= endOfRangeIdx; i++) {
        daysIndices.push(i)
      }
    }
    // Sun & Holidays
  } else if (daySection.includes('&')) {
    const daysRange = daySection.split('&')
    daysRange.forEach((d) => {
      const dayIdx = getDayIndex(d.trim())
      if (dayIdx) {
        daysIndices.push(dayIdx)
      }
    })
    // Sat or Sun
  } else if (daySection.length > 0) {
    // ie., not an empty string
    const dayIdx = getDayIndex(daySection)
    if (dayIdx) {
      daysIndices.push(dayIdx)
    }
  }
  return daysIndices
}

function getEventDay(today: DateTime<boolean>, targetDayIdx: number) {
  const todayAsIdx = today.weekday
  let addXDays = 0
  if (targetDayIdx === 8) {
    // ignore; holidays are scraped elsewhere
  } else if (targetDayIdx >= todayAsIdx) {
    addXDays = targetDayIdx - todayAsIdx
  } else {
    addXDays = 7 - todayAsIdx + targetDayIdx
  }
  return today.plus({ days: addXDays }).toFormat('yyyy-MM-dd') //
}

export function getStartAndEndTimes(
  eventDay: string,
  rawTimeRangeString: string,
) {
  const startAndEndTimes = rawTimeRangeString.split('-')
  const end_time = convertTime(eventDay, startAndEndTimes[1])

  let rawStartTime = startAndEndTimes[0]
  if (!rawStartTime.includes('am') && !rawStartTime.includes('pm')) {
    const endTimeMeridiem = startAndEndTimes[1].includes('pm') ? 'pm' : 'am'
    rawStartTime += endTimeMeridiem
  }
  const start_time = convertTime(eventDay, rawStartTime)
  return { start_time, end_time }
}
