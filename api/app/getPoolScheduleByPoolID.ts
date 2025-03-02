import { Request, Response } from 'express'
import { fetch } from 'undici'
import { setJsonHeaders } from '../../helpers/setHeaders.js'

export default async function getPoolScheduleByPoolID(
  req: Request,
  res: Response,
) {
  setJsonHeaders(req, res)
}
