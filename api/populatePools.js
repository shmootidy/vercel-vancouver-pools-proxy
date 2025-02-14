import fetchPoolSchedules from './fetchPoolSchedules.js'
import fetchPoolIdByName from './fetchPoolIdByName.js'
import updatePoolClosures from './updatePoolClosures.js'

// i'll create the urls by using the name from the calendar, then scrape for alerts. but that's later
// they all share a common url: https://vancouver.ca/parks-recreation-culture/name-of-pool.aspx
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const poolSchedules = await fetchPoolSchedules()

    const poolSchedulesWithClosures = await Promise.all(
      poolSchedules.body.center_events
        .filter((pool) => {
          return pool.events.find((e) => e.title.includes('Pool Closure'))
        })
        .map(async (pool) => {
          const closureEvent = pool.events
            .reverse()
            .find((e) => e.title.includes('Pool Closure'))
          const poolName = stripPoolNameOfAsterisk(pool.center_name)
          const poolID = await fetchPoolIdByName(poolName)

          return {
            pool_id: poolID,
            event_id: closureEvent?.event_item_id,
            closure_end_date: closureEvent?.end_time,
          }
        })
    )

    await updatePoolClosures(poolSchedulesWithClosures)

    return res.status(200).json()
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

function stripPoolNameOfAsterisk(poolName) {
  if (poolName[0] === '*') {
    return poolName.slice(1, poolName.length)
  }
  return poolName
}
