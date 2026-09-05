// FiestaFlow Supabase browser client
// Load this file after @supabase/supabase-js in every HTML page.

const SUPABASE_URL =
  "https://ifiltrmbhraylslgaocy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_y-7Gi7xEz1M6mBI2Bn6C8g_aQ8ctm-V";

(function initializeFiestaFlowSupabase() {
  const maximumAttempts = 50;
  let attempts = 0;

  function initialize() {
    attempts += 1;

    const supabaseLibrary = window.supabase;

    if (
      !supabaseLibrary ||
      typeof supabaseLibrary.createClient !== "function"
    ) {
      if (attempts < maximumAttempts) {
        window.setTimeout(initialize, 100);
      } else {
        console.error(
          "Supabase failed to initialize because its browser library " +
          "did not load. Check your internet connection and script tag."
        );
      }

      return;
    }

    // Prevent the app from creating multiple clients.
    if (window.supabaseClient) {
      return;
    }

    try {
      window.supabaseClient = supabaseLibrary.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );

      window.dispatchEvent(
        new CustomEvent("fiestaflow:supabase-ready")
      );

      console.info(
        "FiestaFlow Supabase client initialized successfully."
      );
    } catch (error) {
      window.supabaseClient = undefined;

      console.error(
        "FiestaFlow Supabase initialization failed:",
        error
      );
    }
  }

  initialize();
})();