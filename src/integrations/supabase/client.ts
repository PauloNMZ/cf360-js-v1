// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://odopgduopmsrtghwhioe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kb3BnZHVvcG1zcnRnaHdoaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzI2NTEsImV4cCI6MjA2MTcwODY1MX0.At0X7Z9kuvhZxRU-D1wdiL57ol9AxdxBDRL_6QfhfZg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);