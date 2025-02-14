import { fetch } from 'undici'
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zijrgnhpgfohsewyqukg.supabase.co',
  process.env.SUPABASE_SECRET_KEY
)

// i'll create the urls by using the name from the calendar, then scrape for alerst. but that's later
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

// return pool name and date of reopening
function findPoolClosures(poolSchedules) {
  // k, hang on.
  // i want to find the last pool closure
  // the end date of the last closure should (hopefully) be when it reopens
  // i can confirm this with a comparison against the title (at least for Killarney, which is currently closed)
  const poolsWithClosures = {}
  poolSchedules.data.center_events.forEach((pool) => {
    const lastPoolClosure = pool.events.findLast((e) => {
      return e.title.include('Pool Closure')
    })
    if (lastPoolClosure) {
      const poolClosureEndDate = e.end_time
      poolsWithClosures[pool.center_name] = poolClosureEndDate
    }
  })
}
