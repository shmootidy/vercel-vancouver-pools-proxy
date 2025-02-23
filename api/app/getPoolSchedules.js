import fetchPoolSchedulesVancouver from '../../helpers/fetchPoolSchedulesVancouver.js'
import fetchPoolSchedulesRichmond from '../../helpers/fetchPoolSchedulesRichmond.js'

export default async function getPoolSchedules(req, res) {
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
    const data = await fetchPoolSchedulesVancouver()
    const richmondPoolSchedules = await fetchPoolSchedulesRichmond()

    return res.status(200).json({
      Vancouver: data.body.center_events,
      Richmond: richmondPoolSchedules,
    })
    // return res.status(200).json(data.body.center_events)
  } catch (error) {
    throw new Error(`Failed to fetch pool schedules: ${error}`)
  }
}
