import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../data/supabase';

// One client for the whole page. The session (admin login) is kept in the browser's local storage.
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
