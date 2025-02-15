import fetchPoolSchedules from './fetchPoolSchedules.js'
import getPoolPageAlerts from '../../helpers/getPoolPageAlerts.js'
import getPoolByName from './getPoolByName.js'

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
          const { id: poolID, url: poolUrl } = await getPoolByName(poolName)
          const poolPageAlerts = await getPoolPageAlerts(poolUrl)

          return {
            pool_id: poolID,
            reason_for_closure: poolPageAlerts,
            event_id: closureEvent?.event_item_id,
            closure_end_date: closureEvent?.end_time,
          }
        })
    )

    const { data, error } = await supabase
      .from('closures')
      .upsert(poolSchedulesWithClosures, {
        onConflict: ['pool_id'],
      })

    if (error) {
      throw new Error(`Error inserting data into supabase: ${error.message}`)
    }

    console.log(`Pools data successfully inserted/updated: ${data}`)
    return res.status(200).json()
  } catch (error) {
    console.error('Failed to update database:', error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

function stripPoolNameOfAsterisk(poolName) {
  if (poolName[0] === '*') {
    return poolName.slice(1, poolName.length)
  }
  return poolName
}
