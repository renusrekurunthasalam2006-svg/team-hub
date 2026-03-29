const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dpqblkpnosqycspicbos.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcWJsa3Bub3NxeWNzcGljYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODQ2NDYsImV4cCI6MjA5MDI2MDY0Nn0.CkcXME5Mu4bHgcxt81VFGl6EyODDlnjhijDldD6vFHE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTeamMembersTable() {
  console.log('🚀 Creating team_members table...\n');

  try {
    // First, check if table exists by trying to query it
    const { data: checkData, error: checkError } = await supabase
      .from('team_members')
      .select('count', { count: 'exact', head: true });

    if (!checkError) {
      console.log('✅ Table already exists!');
      return true;
    }

    // Table doesn't exist, let's try to create it using raw SQL
    // We'll use a workaround by attempting an insert
    console.log('📝 Table does not exist. Attempting to create...');
    
    // Try inserting a test record to trigger table creation
    const testRecord = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'TEST',
      contact: '0000000000',
      linkedin: ''
    };

    const { error: insertError } = await supabase
      .from('team_members')
      .insert([testRecord]);

    if (insertError) {
      console.log('❌ Could not auto-create table');
      console.log('Error:', insertError.message);
      throw insertError;
    }

    // If we got here, table was created! Delete the test record
    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('email', 'test@example.com');

    if (deleteError) {
      console.log('⚠️  Warning: Could not delete test record:', deleteError.message);
    }

    console.log('✅ Table created successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    console.log('\n📋 ALTERNATIVE: Please manually create the table in Supabase:\n');
    console.log(`
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor → New Query
4. Paste this SQL and click Run:

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

5. Then run: node populate-team-members.js
    `);
    return false;
  }
}

async function populateTeamMembers() {
  console.log('📝 Adding team member data...\n');

  const teamMembers = [
    {
      name: 'RENUSRE K',
      email: 'renusrek.cb24@bitsathy.ac.in',
      role: 'CAPTAIN',
      contact: '8667323175',
      linkedin: 'www.linkedin.com/in/renu-sre-k-89a7a3355'
    },
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

  let successCount = 0;
  let failCount = 0;

  for (const member of teamMembers) {
    try {
      const { data, error } = await supabase
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
        failCount++;
      } else {
        console.log(`✅ ${member.name} (${member.role})`);
        successCount++;
      }
    } catch (err) {
      console.log(`❌ ${member.name}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n📊 Results: ${successCount} added, ${failCount} failed`);
  return successCount;
}

async function main() {
  console.log('═══════════════════════════════════════════\n');
  console.log('🎯 Team Manager - Database Setup\n');
  console.log('═══════════════════════════════════════════\n');

  const tableCreated = await createTeamMembersTable();

  if (tableCreated) {
    console.log('\n✅ Table is ready! Populating data...\n');
    const added = await populateTeamMembers();
    console.log(`\n✅ Setup complete! ${added} team members added.`);
  } else {
    console.log('\n⚠️  Please create the table manually and try again.');
  }
}

main().catch(console.error);