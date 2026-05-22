import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://quinwntjxzsmtvjollpn.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1aW53bnRqeHpzbXR2am9sbHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MTk2MzQsImV4cCI6MjA5NDk5NTYzNH0.WREPYVIDhFFIuitAiQ1xYuhZk5xPEKpJEIBjCl3pgYs'
)