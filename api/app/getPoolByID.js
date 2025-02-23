import supabase from '../../helpers/supabaseClient.js'

export default async function getPoolByID(req, res) {
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

  const { poolID } = req.query

  if (!poolID) {
    return res.status(400).json({ error: 'Missing params: poolID' })
  }

  try {
    const { data, error } = await supabase
      .from('pools')
      .select('*, municipalities(*)')
      .in('id', [poolID])
      .single()

    if (error) {
      throw new Error(`Error fetching pool data: ${error.message}`)
    }

    if (!data) {
      throw new Error(`Pool not found.`)
    }
    return res.status(200).json({
      ...data,
      amenities: JSON.parse(data.amenities),
    })
  } catch (error) {
    console.error(error)
    res.status(error.status).json({ success: false, error: error.message })
  }
}
