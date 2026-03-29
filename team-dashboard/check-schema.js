const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dpqblkpnosqycspicbos.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcWJsa3Bub3NxeWNzcGljYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODQ2NDYsImV4cCI6MjA5MDI2MDY0Nn0.CkcXME5Mu4bHgcxt81VFGl6EyODDlnjhijDldD6vFHE'
);

async function checkSchema() {
  console.log('🔍 Checking actual table schemas...\n');

  try {
    // Check what columns exist in each table by trying to select them
    const tablesToCheck = ['tasks', 'user_points', 'announcements', 'messages', 'activity_log'];

    for (const table of tablesToCheck) {
      console.log(`📋 Checking schema for table: ${table}`);

      try {
        // Try to get one record to see the structure
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`  ❌ Error: ${error.message}`);
        } else if (data && data.length > 0) {
          console.log(`  ✅ Columns: ${Object.keys(data[0]).join(', ')}`);
          console.log(`  📄 Sample: ${JSON.stringify(data[0], null, 2)}\n`);
        } else {
          console.log(`  ⚠️  Table exists but is empty\n`);
        }
      } catch (err) {
        console.log(`  ❌ Table access error: ${err.message}\n`);
      }
    }

  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

checkSchema();