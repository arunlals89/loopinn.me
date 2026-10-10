// Loopinn website runtime config.
// Fill these in once the Supabase project exists (see docs/WEBSITE.md and docs/SUPABASE.md).
// The anon key is *meant* to be public — Row Level Security on `waitlist` allows INSERT only.
window.LOOPINN_CONFIG = {
  supabaseUrl: "",      // e.g. https://abcdxyz.supabase.co
  supabaseAnonKey: "",  // Project Settings → API → anon public key
  waitlistTable: "waitlist"
};
