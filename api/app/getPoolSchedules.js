import fetchPoolSchedules from '../../helpers/fetchPoolSchedules.js'
import { stripPipeFromEventTitles } from '../../helpers/poolScheduleUtils.js'

export default async function getPoolSchedules(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization'
    )
    res.setHeader('Content-Type', 'application/json')
    return res.status(204).end() // Respond with no content for OPTIONS request
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Authorization'
  )
  res.setHeader('Content-Type', 'application/json')

  try {
    const data = await fetchPoolSchedules()

    const centerEvents = data.body.center_events.map((e) => {
      return stripPipeFromEventTitles(e)
    })
    return res.status(200).json(centerEvents)
  } catch (error) {
    throw new Error(`Failed to fetch pool schedules: ${error}`)
  }
}
