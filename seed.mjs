import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = Object.fromEntries(
    envFile.split('\n').filter(Boolean).map(line => line.split('='))
);

const supabaseUrl = env.VITE_SUPABASE_URL.trim();
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY.trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    const { error: err1 } = await supabase.from('site_settings').upsert({ id: 'contact_phone', value: '09569414260', updated_at: new Date().toISOString() });
    if (err1) console.error('Phone Error:', err1);
    const { error: err2 } = await supabase.from('site_settings').upsert({ id: 'contact_email', value: 'support@daplash.com', updated_at: new Date().toISOString() });
    if (err2) console.error('Email Error:', err2);
    const { error: err3 } = await supabase.from('site_settings').upsert({ id: 'messenger_id', value: '100064173395989', updated_at: new Date().toISOString() });
    if (err3) console.error('Messenger Error:', err3);
    console.log('Seeded successfully!');
}

seed();
