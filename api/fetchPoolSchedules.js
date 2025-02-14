import { fetch } from 'undici'
export default async function fetchPoolSchedules() {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Authorization'
  )
  res.setHeader('Content-Type', 'application/json')

  const poolCalendarID = 55
  const poolCentreIDs = [
    37, // britannia
    59, // hillcrest
    56, // kensington
    34, // kerrisdale
    36, // killarney
    10, // byng
    47, // renfrew
    45, // templeton
    2, // vaq
  ]
  const payload = {
    activity_category_ids: [],
    activity_ids: [],
    activity_max_age: null,
    activity_min_age: null,
    activity_sub_category_ids: [],
    calendar_id: poolCalendarID,
    center_ids: poolCentreIDs,
    display_all: 0,
    event_type_ids: [],
    facility_ids: [],
    end_time: '',
    search_start_time: '',
  }

  const poolScheduling = {
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/rest/onlinecalendar/multicenter/events?locale=en-US',
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  }

  try {
    const response = await fetch(poolScheduling.url, poolScheduling.init)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(`Failed to fetch pool schedules: ${error}`)
  }
}
