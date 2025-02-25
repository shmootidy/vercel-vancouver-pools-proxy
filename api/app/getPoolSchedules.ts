import { Request, Response } from 'express'
import fetchPoolSchedules from '../../helpers/fetchPoolSchedules.js'
import {
  RichmondPoolSchedules,
  VancouverPoolSchedules,
} from '../../types/interfaces.js'
import { setJsonHeaders } from '../../helpers/setHeaders.js'
import fetchPoolSchedulesRichmond from '../../helpers/fetchPoolSchedulesRichmond.js'

export default async function getPoolSchedules(req: Request, res: Response) {
  setJsonHeaders(req, res)

  try {
    const data = (await fetchPoolSchedules()) as VancouverPoolSchedules
    const richmondPoolSchedules: RichmondPoolSchedules[] =
      await fetchPoolSchedulesRichmond()

    return res
      .status(200)
      .json([...data.body.center_events, ...richmondPoolSchedules])
  } catch (error) {
    throw new Error(`Failed to fetch pool schedules: ${error}`)
  }
}
