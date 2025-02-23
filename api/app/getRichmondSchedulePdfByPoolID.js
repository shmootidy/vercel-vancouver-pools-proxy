import { request } from 'undici'
import findPoolScheduleRichmondPDF from '../../helpers/findPoolScheduleRichmondPDF.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization',
    )
    res.setHeader('Content-Type', 'application/pdf')
    return res.status(204).end()
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Authorization',
  )
  res.setHeader('Content-Type', 'application/pdf')

  try {
    const pdfURL = await findPoolScheduleRichmondPDF()
    const { body } = await request(pdfURL)
    const pdfBuffer = await body.arrayBuffer()
    res.status(200).send(Buffer.from(pdfBuffer))
  } catch (error) {
    console.error('Error fetching PDF:', error)
    res.send(500).send('Failed to fetch PDF')
  }
}
