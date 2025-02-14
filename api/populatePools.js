import { fetch } from 'undici'
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zijrgnhpgfohsewyqukg.supabase.co',
  process.env.SUPABASE_SECRET_KEY
)

// i'll create the urls by using the name from the calendar, then scrape for alerts. but that's later
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const poolSchedules = await fetchPoolSchedules()
    return res.status(200).json(poolSchedules)
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

function findPoolClosures(poolSchedules) {
  return poolCalendars
    .filter((pool) => {
      return pool.events.find((e) => e.title.includes('Pool Closure'))
    })
    .map((pool) => {
      const closureEvent = pool.events
        .reverse()
        .find((e) => e.title.includes('Pool Closure'))
      return {
        poolName: stripPoolNameOfAsterisk(pool.center_name),
        closureEventID: closureEvent?.event_item_id,
        closureEventEndTime: closureEvent?.end_time,
        eventTitle: closureEvent?.title,
      }
    })
}

function stripPoolNameOfAsterisk(poolName) {
  if (poolName[0] === '*') {
    return poolName.slice(1, poolName.length)
  }
  return poolName
}
