import getPoolPageAmenities from '../../helpers/getPoolPageAmenities.js';
import supabase from '../../helpers/supabaseClient.js';
import { setJsonHeaders } from '../../helpers/setHeaders.js';
// this function is only called in curl
export default async function populatePoolAmenities(req, res) {
    setJsonHeaders(req, res);
    try {
        // fetch all pools from database
        const { data: pools } = await supabase.from('pools').select();
        if (!pools || !pools.length) {
            throw new Error('No pools found.');
        }
        // find the amenities
        const poolPageAmenities = await Promise.all(pools.map(async (pool) => {
            return {
                id: pool.id,
                amenities: await getPoolPageAmenities(pool.url),
            };
        }));
        // populate DB
        const results = await Promise.all(poolPageAmenities.map(async ({ id, amenities }) => {
            const { data, error } = await supabase
                .from('pools')
                .update({ amenities: amenities.join(',') })
                .eq('id', id)
                .select();
            return { id, data, error };
        }));
        const errors = results.filter(({ error }) => error);
        if (errors.length) {
            throw new Error(`Some updates failed: ${errors}`);
        }
        return res.status(200).json();
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
