import supabase from './supabaseClient.js';
export default async function getPoolByName(poolName) {
    try {
        const { data, error } = await supabase
            .from('pools')
            .select()
            .eq('name', poolName);
        if (error) {
            throw new Error(`Error fetching pool: ${error.message}`);
        }
        if (!data || !data?.length) {
            throw new Error(`No pool found with the name: ${poolName}`);
        }
        return data[0];
    }
    catch (error) {
        console.error(error.message);
    }
}
