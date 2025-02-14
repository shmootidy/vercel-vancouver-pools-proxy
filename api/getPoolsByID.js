import supabase from './supabaseClient.js'

export default async function getPoolsByID(req, res) {
  const { poolIDs } = req.query

  if (!poolIDs) {
    return res.status(400).json({ error: 'Missing params: poolIDs' })
  }

  try {
    const { data, error } = await supabase
      .from('pools')
      .select()
      .in('id', poolIDs)

    if (error) {
      throw new Error(`Error fetching pool data: ${error.message}`)
    }

    if (data && data.length) {
      return res.status(200).json(data)
    } else {
      throw new Error(`No pools found.`)
    }
  } catch (error) {
    console.error(error)
    res.status(error.status).json({ success: false, error: error.message })
  }
}
