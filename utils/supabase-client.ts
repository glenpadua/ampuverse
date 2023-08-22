import { config } from "dotenv";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

// Load environment variables from .env
config();

const privateKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!privateKey)
  throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_ANON_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url) throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_URL`);

// Create a single supabase client for interacting with your database
export const supabaseClient: SupabaseClient = createClient(url, privateKey);
