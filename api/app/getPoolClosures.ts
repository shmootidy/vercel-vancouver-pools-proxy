import { Request, Response } from 'express'
import supabase from '../../helpers/supabaseClient.js'
import { setJsonHeaders } from '../../helpers/setHeaders.js'

export default async function getPoolClosures(req: Request, res: Response) {
  setJsonHeaders(req, res)

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
