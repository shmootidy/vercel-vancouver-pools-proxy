import getPoolPageAmenities from './getPoolPageAmenities.js'
import supabase from './supabaseClient.js'
import updatePoolAmenities from './updatePoolAmenities.js'

export default async function populatePoolAmenities(req, res) {
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
    // fetch all pools from database
    const { data: pools } = await supabase.from('pools').select()

    const poolPageAmenities = await Promise.all(
      pools.map(async (pool) => {
        return {
          id: pool.id,
          amenities: await getPoolPageAmenities(pool.url),
        }
      })
    )
    await updatePoolAmenities(poolPageAmenities)

    return res.status(200).json()
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
