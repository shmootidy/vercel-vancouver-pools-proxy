import supabase from '../../helpers/supabaseClient.js';
import fetchPoolSchedules from '../../helpers/fetchPoolSchedules.js';
import getPoolPageAlerts from '../../helpers/getPoolPageAlerts.js';
import getPoolByName from '../../helpers/getPoolByName.js';
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    try {
        const poolSchedules = (await fetchPoolSchedules());
        const poolSchedulesWithClosures = await Promise.all(poolSchedules.body.center_events
            .filter((pool) => {
            return pool.events.find((e) => e.title.includes('Pool Closure'));
        })
            .map(async (pool) => {
            const closureEvents = pool.events.filter((e) => e.title.includes('Pool Closure'));
            const poolName = stripPoolNameOfAsterisk(pool.center_name);
            const poolObj = await getPoolByName(poolName);
            if (!poolObj) {
                throw new Error(`Pool not found: ${poolName}`);
            }
            const { id, url } = poolObj;
            const poolPageAlerts = await getPoolPageAlerts(url);
            const lastClosureEvent = closureEvents[closureEvents.length - 1];
            return {
                pool_id: id,
                reason_for_closure: poolPageAlerts,
                event_id: lastClosureEvent?.event_item_id,
                closure_start_date: closureEvents[0]?.start_time,
                closure_end_date: lastClosureEvent?.end_time,
            };
        }));
        const { data, error } = await supabase
            .from('closures')
            .insert(poolSchedulesWithClosures);
        if (error) {
            throw new Error(`Error inserting data into supabase: ${error.message}`);
        }
        console.log(`Pools data successfully inserted: ${data}`);
        return res.status(200).json();
    }
    catch (error) {
        console.error('Failed to update database:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
function stripPoolNameOfAsterisk(poolName) {
    if (poolName[0] === '*') {
        return poolName.slice(1, poolName.length);
    }
    return poolName;
}
