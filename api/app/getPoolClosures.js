import supabase from '../../helpers/supabaseClient.js'

export default async function getPoolClosures(req, res) {
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
    const { data, error } = await supabase.from('closures').select()

    if (error) {
      throw new Error(`Error fetching pool closures: ${error.message}`)
    }

    if (data && data.length > 0) {
      return res.status(200).json(data)
    } else {
      throw new Error(`No pool closure data found.`)
    }
  } catch (error) {
    console.error(error.message)
    return res
      .status(error.status)
      .json({ success: false, error: error.message })
  }
}
