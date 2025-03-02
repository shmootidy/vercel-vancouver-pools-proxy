import { Request, Response } from 'express'

import { RichmondPoolSchedules } from '../../types/interfaces.js'
import { setJsonHeaders } from '../../helpers/setHeaders.js'
import supabase from '../../helpers/supabaseClient.js'
import fetchPoolSchedulesRichmond from '../../helpers/fetchPoolSchedulesRichmond.js'

export interface RichmondPoolScheduleArgs {
  poolName: string
  poolUrl: string
}

export default async function getRichmondPoolSchedules(
  req: Request,
  res: Response,
) {
  setJsonHeaders(req, res)

  const { poolIDs } = req.query as { poolIDs: string }

  if (!poolIDs) {
    return res.status(400).json({ error: 'Missing params: poolIDs' })
  }

  try {
    const pool_ids = poolIDs.split(',').map((id) => parseInt(id))
    const { data: poolData, error } = await supabase
      .from('pools')
      .select()
      .eq('municipality_id', 2)
      .in('id', pool_ids)

    if (error) {
      throw new Error(`Error fetching pools: ${error.message}`)
    }

    if (poolData && poolData.length > 0) {
      const richmondPoolScheduleArgs: RichmondPoolScheduleArgs[] = poolData.map(
        (p) => {
          return {
            poolName: p.name,
            poolUrl: p.url || '',
          }
        },
      )

      const richmondPoolSchedules: RichmondPoolSchedules[] =
        await fetchPoolSchedulesRichmond(richmondPoolScheduleArgs)

      return res.status(200).json(richmondPoolSchedules)
    }
  } catch (error) {
    throw new Error(`Failed to fetch pool schedules: ${error}`)
  }
}
