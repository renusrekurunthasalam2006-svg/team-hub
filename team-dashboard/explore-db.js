const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dpqblkpnosqycspicbos.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcWJsa3Bub3NxeWNzcGljYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODQ2NDYsImV4cCI6MjA5MDI2MDY0Nn0.CkcXME5Mu4bHgcxt81VFGl6EyODDlnjhijDldD6vFHE'
);

async function exploreDatabase() {
  console.log('🔍 Exploring Supabase Database...\n');

  try {
    // First, let's see what tables exist by trying to query them
    const possibleTables = [
      'tasks', 'announcements', 'user_points', 'messages', 'activity_log',
      'users', 'team_members', 'members', 'projects', 'assignments',
      'rewards', 'points', 'leaderboard', 'teams', 'team_data'
    ];

    console.log('📋 Checking for existing tables:\n');

    for (const table of possibleTables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (!error) {
          console.log(`✅ ${table}: ${count || 0} records`);

          // If table has data, show sample
          if (count > 0) {
            const { data: sampleData } = await supabase
              .from(table)
              .select('*')
              .limit(2);

            if (sampleData && sampleData.length > 0) {
              console.log(`   Sample data from ${table}:`);
              sampleData.forEach((item, index) => {
                console.log(`   ${index + 1}. ${JSON.stringify(item, null, 2)}`);
              });
            }
          }
        }
      } catch (tableError) {
        // Table doesn't exist or access denied
      }
    }

    console.log('\n🔧 If your data is in different tables, please let me know the correct table names.');
    console.log('💡 I can help you populate sample data or adjust the queries to match your schema.');

  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

exploreDatabase();