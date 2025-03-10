import { Request, Response } from 'express'
import { fetch } from 'undici'
import { VancouverPoolSchedules } from '../../types/interfaces.js'
import { setJsonHeaders } from '../../helpers/setHeaders.js'

export default async function getPoolScheduleByCentreID(
  req: Request,
  res: Response,
) {
  setJsonHeaders(req, res)

  const { centreID } = req.query

  if (!centreID) {
    return res.status(400).json({ error: 'Missing params: centreID' })
  }

  const poolCalendarID = 55

  const payload = {
    activity_category_ids: [],
    activity_ids: [],
    activity_max_age: null,
    activity_min_age: null,
    activity_sub_category_ids: [],
    calendar_id: poolCalendarID,
    center_ids: [centreID],
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
        `Failed to fetch data: ${response.status} ${response.statusText}`,
      )
    }

    const data = (await response.json()) as VancouverPoolSchedules

    return res.status(200).json(data.body.center_events[0])
  } catch (error) {
    console.error(error)
    res.status(error.status).json({ success: false, error: error.message })
  }
}
