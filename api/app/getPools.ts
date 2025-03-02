import { Request, Response } from 'express'
import supabase from '../../helpers/supabaseClient.js'
import { setJsonHeaders } from '../../helpers/setHeaders.js'

export default async function getPools(req: Request, res: Response) {
  setJsonHeaders(req, res)

  try {
    const { data: poolsData, error: poolsError } = await supabase
      .from('pools')
      .select()
    const { data: municipalities, error: municipalitiesError } = await supabase
      .from('municipalities')
      .select()

    if (poolsError) {
      throw new Error(`Error fetching pool data: ${poolsError.message}`)
    }
    if (municipalitiesError) {
      throw new Error(
        `Error fetching pool data: ${municipalitiesError.message}`,
      )
    }

    if (
      poolsData &&
      poolsData.length &&
      municipalities &&
      municipalities.length
    ) {
      const formattedData = poolsData.map((d) => {
        const matchingMunicipality = municipalities.find(
          (m) => m.id === d.municipality_id,
        )?.name
        return {
          ...d,
          amenities: d.amenities ? JSON.parse(d.amenities) : [],
          municipality: matchingMunicipality || '',
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
