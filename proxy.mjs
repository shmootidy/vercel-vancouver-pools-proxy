import { fetch } from 'undici'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Authorization'
  )
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const url = 'https://vancouver.opendatasoft.com/explore/v2.1'

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')

    res.status(200).json(data) // Send back the JSON data
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` })
  }
}
