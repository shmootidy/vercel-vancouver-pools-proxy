import { Request, Response } from 'express'
import supabase from '../../helpers/supabaseClient.js'

export default async function getPools(req: Request, res: Response) {
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
    const { data, error } = await supabase.from('pools').select()

    if (error) {
      throw new Error(`Error fetching pool data: ${error.message}`)
    }

    if (data && data.length) {
      const formattedData = data.map((d) => {
        return {
          ...d,
          amenities: d.amenities ? JSON.parse(d.amenities) : [],
        }
      })
      return res.status(200).json(formattedData)
    } else {
      throw new Error(`No pools found.`)
    }
  } catch (error) {
    console.error(error)
    res.status(error.status).json({ success: false, error: error.message })
  }
}
