const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dpqblkpnosqycspicbos.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcWJsa3Bub3NxeWNzcGljYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODQ2NDYsImV4cCI6MjA5MDI2MDY0Nn0.CkcXME5Mu4bHgcxt81VFGl6EyODDlnjhijDldD6vFHE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log('🔧 Setting up team_members table...\n');

  // Step 1: Attempt to insert directly (Supabase will auto-create if RLS is off)
  console.log('Step 1: Attempting to create table via insert...');
  
  const testData = {
    name: 'RENUSRE K',
    email: 'renusrek.cb24@bitsathy.ac.in',
    role: 'CAPTAIN',
    contact: '8667323175',
    linkedin: 'www.linkedin.com/in/renu-sre-k-89a7a3355'
  };

  const { error: insertError, data: insertData } = await supabase
    .from('team_members')
    .insert([testData]);

  if (insertError) {
    if (insertError.message.includes('Could not find the table')) {
      console.log('❌ Table does not exist in Supabase!');
      console.log('\n📋 IMPORTANT: You must create the table manually in Supabase:\n');
      console.log('1. Go to: https://supabase.com/dashboard');
      console.log('2. Select your project: dpqblkpnosqycspicbos');
      console.log('3. Click "SQL Editor" → "New Query"');
      console.log('4. Copy and paste this SQL, then click "Run":\n');
      console.log(`
──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    contact TEXT,
    linkedin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.team_members TO anon;
GRANT ALL ON public.team_members TO authenticated;
──────────────────────────────────────────────────────────────
      `);
      console.log('\n5. Click "Run"');
      console.log('6. Wait for success message');
      console.log('7. Then run this script again: node refresh-schema.js\n');
      return false;
    } else {
      console.log('❌ Error:', insertError.message);
      return false;
    }
  }

  console.log('✅ First record inserted successfully!\n');

  // Step 2: Now populate the rest
  console.log('Step 2: Populating team data...\n');

  const teamMembers = [
    {
      name: 'MONIKA R',
      email: 'monikar.cb24@bitsathy.ac.in',
      role: 'VICE-CAPTAIN',
      contact: '9629438344',
      linkedin: 'https://www.linkedin.com/in/monikar43/'
    },
    {
      name: 'KARTHIESWARAN E',
      email: 'karthieswarane.cb24@bitsathy.ac.in',
      role: 'STRATEGIST',
      contact: '9363629585',
      linkedin: ''
    },
    {
      name: 'KARTHIKA K',
      email: 'karthikak.cb24@bitsathy.ac.in',
      role: 'MEMBER 5',
      contact: '8012432050',
      linkedin: 'www.linkedin.com/in/karthika-krishnamoorthi'
    },
    {
      name: 'SELVADHARSHINI M S',
      email: 'selvadharshinims.cs25@bitsathy.ac.in',
      role: 'MEMBER 8',
      contact: '8056116846',
      linkedin: ''
    },
    {
      name: 'SUBHASRI M',
      email: 'subhasrim.it25@bitsathy.ac.in',
      role: 'MEMBER 11',
      contact: '8012267630',
      linkedin: ''
    },
    {
      name: 'PRASANTH K',
      email: 'prasanthk.it25@bitsathy.ac.in',
      role: 'MEMBER 10',
      contact: '7092027123',
      linkedin: ''
    },
    {
      name: 'RITHEESH S',
      email: 'ritheeshs.it25@bitsathy.ac.in',
      role: 'MEMBER 9',
      contact: '8248704721',
      linkedin: ''
    },
    {
      name: 'AVANTHIKA T S',
      email: 'avanthikats.it25@bitsathy.ac.in',
      role: 'MEMBER 1',
      contact: '6381492601',
      linkedin: ''
    }
  ];

  let added = 1; // Already added the first one
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

    if (error) {
      console.log(`❌ ${member.name}: ${error.message}`);
    } else {
      console.log(`✅ ${member.name}`);
      added++;
    }
  }

  console.log(`\n✅ Success! ${added} team members added to database.\n`);
  console.log('🎉 Refresh your dashboard and click "👥 Team Members" to see the results!\n');
  return true;
}

setup().catch(console.error);