const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dpqblkpnosqycspicbos.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcWJsa3Bub3NxeWNzcGljYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODQ2NDYsImV4cCI6MjA5MDI2MDY0Nn0.CkcXME5Mu4bHgcxt81VFGl6EyODDlnjhijDldD6vFHE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log('🔍 Diagnosing Supabase Setup...\n');

  // Check 1: Try to query the table
  console.log('Check 1: Attempting to query team_members table...');
  const { data: queryData, error: queryError } = await supabase
    .from('team_members')
    .select('count', { count: 'exact', head: true });

  if (queryError) {
    console.log(`❌ Query failed: ${queryError.message}`);
    if (queryError.message.includes('Could not find the table')) {
      console.log('   → Table does NOT exist in Supabase!\n');
      return 'NO_TABLE';
    }
  } else {
    console.log('✅ Table exists and is queryable!\n');
    return 'TABLE_EXISTS';
  }
}

async function main() {
  const status = await diagnose();

  if (status === 'NO_TABLE') {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚨 TABLE DOES NOT EXIST - MANUAL CREATION REQUIRED');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('❌ The team_members table has NOT been created in Supabase yet.\n');

    console.log('📋 STEPS TO FIX:\n');
    
    console.log('1️⃣ Open your browser and go to:');
    console.log('   https://supabase.com/dashboard\n');

    console.log('2️⃣ Select your project:');
    console.log('   Project: dpqblkpnosqycspicbos\n');

    console.log('3️⃣ Click on "SQL Editor" in the left sidebar\n');

    console.log('4️⃣ Click "New Query" (+ button)\n');

    console.log('5️⃣ SELECT ALL and DELETE any existing content in the editor\n');

    console.log('6️⃣ COPY THIS ENTIRE SQL BLOCK AND PASTE IT:\n');

    console.log('───────────────────────────────────────────────────────────');
    console.log(`
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    contact TEXT,
    linkedin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove RLS if enabled
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.team_members TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
    `);
    console.log('───────────────────────────────────────────────────────────\n');

    console.log('7️⃣ Click the "Run" button (or press Ctrl+Enter)\n');

    console.log('8️⃣ You should see "Success. No rows returned"\n');

    console.log('9️⃣ Go to "Table Editor" to verify team_members appears in the list\n');

    console.log('🔟 Then come back here and run:');
    console.log('    node populate-team-members.js\n');

    console.log('═══════════════════════════════════════════════════════════\n');

  } else if (status === 'TABLE_EXISTS') {
    console.log('✅ Table exists! Now populating with team data...\n');
    
    const teamMembers = [
      { name: 'RENUSRE K', email: 'renusrek.cb24@bitsathy.ac.in', role: 'CAPTAIN', contact: '8667323175', linkedin: 'www.linkedin.com/in/renu-sre-k-89a7a3355' },
      { name: 'MONIKA R', email: 'monikar.cb24@bitsathy.ac.in', role: 'VICE-CAPTAIN', contact: '9629438344', linkedin: 'https://www.linkedin.com/in/monikar43/' },
      { name: 'KARTHIESWARAN E', email: 'karthieswarane.cb24@bitsathy.ac.in', role: 'STRATEGIST', contact: '9363629585', linkedin: '' },
      { name: 'KARTHIKA K', email: 'karthikak.cb24@bitsathy.ac.in', role: 'MEMBER 5', contact: '8012432050', linkedin: 'www.linkedin.com/in/karthika-krishnamoorthi' },
      { name: 'SELVADHARSHINI M S', email: 'selvadharshinims.cs25@bitsathy.ac.in', role: 'MEMBER 8', contact: '8056116846', linkedin: '' },
      { name: 'SUBHASRI M', email: 'subhasrim.it25@bitsathy.ac.in', role: 'MEMBER 11', contact: '8012267630', linkedin: '' },
      { name: 'PRASANTH K', email: 'prasanthk.it25@bitsathy.ac.in', role: 'MEMBER 10', contact: '7092027123', linkedin: '' },
      { name: 'RITHEESH S', email: 'ritheeshs.it25@bitsathy.ac.in', role: 'MEMBER 9', contact: '8248704721', linkedin: '' },
      { name: 'AVANTHIKA T S', email: 'avanthikats.it25@bitsathy.ac.in', role: 'MEMBER 1', contact: '6381492601', linkedin: '' }
    ];

    let added = 0;
    for (const member of teamMembers) {
      const { error } = await supabase
        .from('team_members')
        .insert([{
          name: member.name,
          email: member.email,
          role: member.role,
          contact: member.contact,
          linkedin: member.linkedin || null
        }]);

      if (!error) {
        console.log(`✅ ${member.name}`);
        added++;
      } else {
        console.log(`❌ ${member.name}: ${error.message}`);
      }
    }

    console.log(`\n✅ Added ${added} team members!`);
    console.log('🎉 Refresh your dashboard and check the Team Members tab!\n');
  }
}

main().catch(console.error);