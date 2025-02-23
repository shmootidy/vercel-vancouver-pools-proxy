import supabase from '../../helpers/supabaseClient.js';
import { setJsonHeaders } from '../../helpers/setHeaders.js';
export default async function getPools(req, res) {
    setJsonHeaders(req, res);
    try {
        const { data, error } = await supabase.from('pools').select();
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
