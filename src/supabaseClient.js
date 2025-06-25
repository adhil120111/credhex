// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://broseasswahrbiglvplk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyb3NlYXNzd2FocmJpZ2x2cGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDQ0NTMsImV4cCI6MjA2NjMyMDQ1M30.GQoMOXJ8pnfdGVWNCwLT2ZK-anhBeIW8UVWp7De70EM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
