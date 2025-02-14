import supabase from './supabaseClient.js'

export default async function fetchPoolIdByName(poolName) {
  try {
    const { data, error } = await supabase
      .from('pools')
      .select('id')
      .eq('name', poolName)

    if (error) {
      throw new Error(`Error fetching pool ID: ${error.message}`)
    }

    if (data && data.length > 0) {
      return data[0].id
    } else {
      throw new Error(`No pool found with the name: ${poolName}`)
    }
  } catch (error) {
    console.error(error.message)
  }
}
