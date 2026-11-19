// Supabase connection for the Anaqia shop. Both values are public by design:
// the anon key only allows what the database security rules
// (supabase/schema.sql) permit. Vercel environment variables, if set, win.
// Never put the service_role key or the database password here.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://homqfjxeoeevyqndyhsy.supabase.co'
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXFmanhlb2VldnlxbmR5aHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxMTAzMDAsImV4cCI6MjExMDY4NjMwMH0.3PnWDDHmn1K8X5Oh2m8OrH1Lb69RSlYPFZdTxnXxgig'
