// Replace with your actual Supabase URL and anon public key
const SUPABASE_URL = 'https://ifiltrmbhraylslgaocy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_y-7Gi7xEz1M6mBI2Bn6C8g_aQ8ctm-V';

// Wait for Supabase library to load from CDN
function initializeSupabaseClient() {
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded. Retrying in 100ms...');
        setTimeout(initializeSupabaseClient, 100);
        return;
    }
    
    try {
        // Create the client using the CDN-loaded library
        // Use supabase.createClient() and store it separately
        const supabaseLib = window.supabase;
        window.supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully.');
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSupabaseClient);
} else {
    initializeSupabaseClient();
}
