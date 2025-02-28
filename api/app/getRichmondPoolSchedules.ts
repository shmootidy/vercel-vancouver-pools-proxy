import { Request, Response } from 'express'

import { RichmondPoolSchedules } from '../../types/interfaces.js'
import { setJsonHeaders } from '../../helpers/setHeaders.js'
import fetchPoolSchedulesRichmond from '../../helpers/fetchPoolSchedulesRichmond.js'

export default async function getRichmondPoolSchedules(
  req: Request,
  res: Response,
) {
  setJsonHeaders(req, res)

  try {
    const richmondPoolSchedules: RichmondPoolSchedules[] =
      await fetchPoolSchedulesRichmond()

    return res.status(200).json(richmondPoolSchedules)
  } catch (error) {
    throw new Error(`Failed to fetch pool schedules: ${error}`)
  }
}
