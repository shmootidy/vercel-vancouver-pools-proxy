import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
if (!process.env.SUPABASE_SECRET_KEY) {
    throw new Error('Missing SUPABASE_SECRET_KEY');
}
const supabase = createClient('https://zijrgnhpgfohsewyqukg.supabase.co', process.env.SUPABASE_SECRET_KEY);
export default supabase;
