// Supabase connection. Both values are safe to publish: the anon key only
// allows what the database security rules (supabase/schema.sql) permit.
// Leave them empty to run the shop on the built-in demo catalogue.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
