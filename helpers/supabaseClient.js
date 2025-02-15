import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zijrgnhpgfohsewyqukg.supabase.co',
  process.env.SUPABASE_SECRET_KEY
)

export default supabase
