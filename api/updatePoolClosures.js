import supabase from './supabaseClient.js'

export default async function updatePoolClosures(poolUpdates) {
  try {
    const { data, error } = await supabase
      .from('closures')
      .upsert(poolUpdates, {
        onConflict: ['pool_id'],
      })

    if (error) {
      throw new Error(`Error inserting data into supabase: ${error.message}`)
    }

    console.log(`Pools data successfully inserted/updated: ${data}`)
  } catch (error) {
    console.error('Failed to update database:', error.message)
  }
}
