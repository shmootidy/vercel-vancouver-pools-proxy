import { Request, Response } from 'express'
import fetchPoolSchedules from '../../helpers/fetchPoolSchedules.js'
import { VancouverPoolSchedules } from '../../types/interfaces.js'

export default async function getPoolSchedules(req: Request, res: Response) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization',
    )
    res.setHeader('Content-Type', 'application/json')
    return res.status(204).end() // Respond with no content for OPTIONS request
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Authorization',
  )
  res.setHeader('Content-Type', 'application/json')

  try {
    const data = (await fetchPoolSchedules()) as VancouverPoolSchedules

    return res.status(200).json(data.body.center_events)
  } catch (error) {
    throw new Error(`Failed to fetch pool schedules: ${error}`)
  }
}
