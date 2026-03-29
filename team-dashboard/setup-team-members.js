const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://dpqblkpnosqycspicbos.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcWJsa3Bub3NxeWNzcGljYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODQ2NDYsImV4cCI6MjA5MDI2MDY0Nn0.CkcXME5Mu4bHgcxt81VFGl6EyODDlnjhijDldD6vFHE';

const supabase = createClient(supabaseUrl, supabaseKey);

// Team member data from user
const teamMembers = [
  {
    name: 'RENUSRE K',
    email: 'renusrek.cb24@bitsathy.ac.in',
    role: 'CAPTAIN',
    contact: '8667323175',
    linkedin: 'www.linkedin.com/in/renu-sre-k-89a7a3355',
    user_id: '70cd3b6a-4249-44c3-a134-702303389614' // captain
  },
  {
    name: 'MONIKA R',
    email: 'monikar.cb24@bitsathy.ac.in',
    role: 'VICE-CAPTAIN',
    contact: '9629438344',
    linkedin: 'https://www.linkedin.com/in/monikar43/',
    user_id: '1b3a7002-44c8-4a1c-840e-8d2afd4bdf3a' // vice_captain
  },
  {
    name: 'KARTHIESWARAN E',
    email: 'karthieswarane.cb24@bitsathy.ac.in',
    role: 'STRATEGIST',
    contact: '9363629585',
    linkedin: '',
    user_id: 'b15ae88c-468b-4b65-b093-e7cd3edeb2a3' // member1
  },
  {
    name: 'KARTHIKA K',
    email: 'karthikak.cb24@bitsathy.ac.in',
    role: 'MEMBER 5',
    contact: '8012432050',
    linkedin: 'www.linkedin.com/in/karthika-krishnamoorthi',
    user_id: '0b5802b2-be7a-4007-b9b1-511bd2d405d2' // member5
  },
  {
    name: 'SELVADHARSHINI M S',
    email: 'selvadharshinims.cs25@bitsathy.ac.in',
    role: 'MEMBER 8',
    contact: '8056116846',
    linkedin: '',
    user_id: '8fdc30fc-1c46-4cb7-bfe8-912c73fe776d' // member8
  },
  {
    name: 'SUBHASRI M',
    email: 'subhasrim.it25@bitsathy.ac.in',
    role: 'MEMBER 11',
    contact: '8012267630',
    linkedin: '',
    user_id: 'da278fd4-9090-4eba-93a7-7d6b9e48957b' // member11
  },
  {
    name: 'PRASANTH K',
    email: 'prasanthk.it25@bitsathy.ac.in',
    role: 'MEMBER 10',
    contact: '7092027123',
    linkedin: '',
    user_id: '7146a587-16dc-467c-87d6-3e2164ef99e8' // member10
  },
  {
    name: 'RITHEESH S',
    email: 'ritheeshs.it25@bitsathy.ac.in',
    role: 'MEMBER 9',
    contact: '8248704721',
    linkedin: '',
    user_id: '4f81d463-185c-4b30-9412-3c36caa18ee4' // member9
  },
  {
    name: 'AVANTHIKA T S',
    email: 'avanthikats.it25@bitsathy.ac.in',
    role: 'MEMBER 1',
    contact: '6381492601',
    linkedin: '',
    user_id: 'b15ae88c-468b-4b65-b093-e7cd3edeb2a3' // member1 (same as strategist)
  }
];

async function createTeamMembersTable() {
  console.log('🚀 Creating team_members table...');

  try {
    // First, let's try to create the table using SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS team_members (
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
      `
    });

    if (error) {
      console.log('❌ Could not create table via RPC, you may need to create it manually in Supabase dashboard');
      console.log('Error:', error.message);
      return false;
    }

    console.log('✅ Team members table created successfully');
    return true;

  } catch (err) {
    console.log('❌ Error creating table:', err.message);
    console.log('💡 You may need to create the team_members table manually in your Supabase dashboard');
    return false;
  }
}

async function populateTeamMembers() {
  console.log('📝 Adding team member data...');

  for (const member of teamMembers) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([{
          user_id: member.user_id,
          name: member.name,
          email: member.email,
          role: member.role,
          contact: member.contact,
          linkedin: member.linkedin || null
        }]);

      if (error) {
        console.log(`❌ Error adding ${member.name}:`, error.message);
      } else {
        console.log(`✅ Added ${member.name} (${member.role})`);
      }
    } catch (err) {
      console.log(`❌ Error adding ${member.name}:`, err.message);
    }
  }
}

async function checkTeamMembers() {
  console.log('🔍 Checking team_members table...');

  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .limit(10);

    if (error) {
      console.log('❌ Error checking team members:', error.message);
      return;
    }

    console.log(`📊 Found ${data.length} team members:`);
    data.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.name} - ${member.role} (${member.email})`);
    });

  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

async function main() {
  console.log('🎯 Setting up team members data...\n');

  // Try to create the table
  const tableCreated = await createTeamMembersTable();

  if (tableCreated) {
    // Populate with data
    await populateTeamMembers();

    // Check results
    await checkTeamMembers();
  } else {
    console.log('\n📋 MANUAL TABLE CREATION REQUIRED:');
    console.log('Please create this table in your Supabase dashboard:');
    console.log(`
CREATE TABLE team_members (
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
    `);

    console.log('\n📝 Then run this script again to populate the data.');
  }
}

main().catch(console.error);