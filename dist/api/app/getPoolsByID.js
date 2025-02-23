import supabase from '../../helpers/supabaseClient.js';
import { setJsonHeaders } from '../../helpers/setHeaders.js';
export default async function getPoolsByID(req, res) {
    setJsonHeaders(req, res);
    const { poolIDs } = req.query;
    if (!poolIDs) {
        return res.status(400).json({ error: 'Missing params: poolIDs' });
    }
    try {
        const pool_ids = poolIDs.split(',').map((id) => parseInt(id));
        const { data, error } = await supabase
            .from('pools')
            .select()
            .in('id', pool_ids);
        if (error) {
            throw new Error(`Error fetching pool data: ${error.message}`);
        }
        if (data && data.length) {
            const formattedData = data.map((d) => {
                return {
                    ...d,
                    amenities: d.amenities ? JSON.parse(d.amenities) : [],
                };
            });
            return res.status(200).json(formattedData);
        }
        else {
            throw new Error(`No pools found.`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(error.status).json({ success: false, error: error.message });
    }
}
