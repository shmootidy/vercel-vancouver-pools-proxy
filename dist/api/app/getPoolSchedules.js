import fetchPoolSchedules from '../../helpers/fetchPoolSchedules.js';
import { setJsonHeaders } from '../../helpers/setHeaders.js';
export default async function getPoolSchedules(req, res) {
    setJsonHeaders(req, res);
    try {
        const data = (await fetchPoolSchedules());
        return res.status(200).json(data.body.center_events);
    }
    catch (error) {
        throw new Error(`Failed to fetch pool schedules: ${error}`);
    }
}
