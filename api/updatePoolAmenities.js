import supabase from './supabaseClient.js'

export default async function updatePoolAmenities(poolUpdates) {
  try {
    if (
      !Array.isArray(poolUpdates) ||
      poolUpdates.some((u) => !u.id || !Array.isArray(u.amenities))
    ) {
      throw new Error('Invalid request body')
    }

    const results = await Promise.all(
      poolUpdates.map(async ({ id, amenities }) => {
        const { data, error } = await supabase
          .from('pools')
          .update({ amenities })
          .eq('id', id)
          .select()
        return { id, data, error }
      })
    )

    const errors = results.filter(({ error }) => error)
    if (errors.length) {
      throw new Error(`Some updates failed: ${errors}`)
    }

    return results
  } catch (error) {
    console.error('Failed to update database:', error.message)
  }
}
