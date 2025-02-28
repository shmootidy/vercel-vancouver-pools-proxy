import { Request, Response } from 'express'
import fetchPoolSchedules from '../../helpers/fetchPoolSchedules.js'
import { VancouverPoolSchedules } from '../../types/interfaces.js'
import { setJsonHeaders } from '../../helpers/setHeaders.js'

export default async function getVancouverPoolSchedules(
  req: Request,
  res: Response,
) {
  setJsonHeaders(req, res)

  try {
    const data = (await fetchPoolSchedules()) as VancouverPoolSchedules

    return res.status(200).json(data.body.center_events)
  } catch (error) {
    throw new Error(`Failed to fetch pool schedules: ${error}`)
  }
}
