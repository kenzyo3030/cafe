import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vtxqvbvpyfyissvtupuq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0eHF2YnZweWZ5aXNzdnR1cHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDcyODYsImV4cCI6MjA2ODA4MzI4Nn0.arGx9pkaeOA2d-hI35haQRQBM3K08dGPRmBrnYYRFKc'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
