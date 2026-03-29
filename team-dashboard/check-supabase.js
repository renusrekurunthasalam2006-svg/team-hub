const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dpqblkpnosqycspicbos.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcWJsa3Bub3NxeWNzcGljYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODQ2NDYsImV4cCI6MjA5MDI2MDY0Nn0.CkcXME5Mu4bHgcxt81VFGl6EyODDlnjhijDldD6vFHE'
);

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n');

  try {
    const tables = ['tasks', 'announcements', 'user_points', 'messages', 'activity_log'];

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        console.log(`${table}: ${count || 0} records`);

        if (error) {
          console.log(`  ❌ Error: ${error.message}`);
        } else {
          // Get a sample of the data
          const { data: sampleData, error: sampleError } = await supabase
            .from(table)
            .select('*')
            .limit(3);

          if (!sampleError && sampleData && sampleData.length > 0) {
            console.log(`  📋 Sample data:`);
            sampleData.forEach((item, index) => {
              console.log(`    ${index + 1}. ${JSON.stringify(item, null, 2).slice(0, 100)}...`);
            });
          }
        }
        console.log('');
      } catch (tableError) {
        console.log(`${table}: ❌ Table error - ${tableError.message}\n`);
      }
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

checkTables();