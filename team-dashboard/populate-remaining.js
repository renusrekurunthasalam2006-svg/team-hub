const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dpqblkpnosqycspicbos.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcWJsa3Bub3NxeWNzcGljYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODQ2NDYsImV4cCI6MjA5MDI2MDY0Nn0.CkcXME5Mu4bHgcxt81VFGl6EyODDlnjhijDldD6vFHE'
);

// Team member data
const teamMembers = {
  captain: "70cd3b6a-4249-44c3-a134-702303389614",
  vice_captain: "1b3a7002-44c8-4a1c-840e-8d2afd4bdf3a",
  member1: "b15ae88c-468b-4b65-b093-e7cd3edeb2a3",
  member5: "0b5802b2-be7a-4007-b9b1-511bd2d405d2",
  member8: "8fdc30fc-1c46-4cb7-bfe8-912c73fe776d",
  member9: "4f81d463-185c-4b30-9412-3c36caa18ee4",
  member10: "7146a587-16dc-467c-87d6-3e2164ef99e8",
  member11: "da278fd4-9090-4eba-93a7-7d6b9e48957b"
};

async function populateRemainingData() {
  console.log('🚀 Adding remaining team data...\n');

  try {
    // First, let's try to understand the tasks table schema by attempting a simple insert
    console.log('📋 Checking tasks table schema...');
    try {
      const { error } = await supabase.from('tasks').insert({
        title: "Test Task",
        description: "Testing task insertion",
        status: "pending"
      });
      if (error) {
        console.log(`Tasks table columns likely: title, description, status`);
        console.log(`Error details: ${error.message}`);
      } else {
        console.log('✅ Basic task inserted successfully');
      }
    } catch (err) {
      console.log(`❌ Tasks table schema check failed: ${err.message}`);
    }

    // Try to populate tasks with minimal required fields
    console.log('\n📋 Adding tasks with basic fields...');
    const basicTasksData = [
      {
        title: "Complete Project Documentation",
        description: "Write comprehensive documentation for the team project",
        status: "completed"
      },
      {
        title: "Code Review Session",
        description: "Review pull requests and provide feedback",
        status: "in_progress"
      },
      {
        title: "Database Optimization",
        description: "Optimize database queries for better performance",
        status: "pending"
      },
      {
        title: "UI/UX Design Updates",
        description: "Update the user interface based on feedback",
        status: "completed"
      },
      {
        title: "Testing Framework Setup",
        description: "Set up automated testing framework",
        status: "in_progress"
      }
    ];

    for (const task of basicTasksData) {
      const { error } = await supabase.from('tasks').insert(task);
      if (error) {
        console.log(`❌ Error adding task "${task.title}": ${error.message}`);
      } else {
        console.log(`✅ Added task: ${task.title}`);
      }
    }

    // For user_points, since RLS is blocking inserts, let's try a different approach
    // Maybe the table allows updates but not inserts, or we need authentication
    console.log('\n📊 Note about user_points:');
    console.log('The user_points table has Row Level Security (RLS) enabled.');
    console.log('You may need to:');
    console.log('1. Disable RLS temporarily in Supabase dashboard');
    console.log('2. Or use a service key instead of anon key');
    console.log('3. Or create the data directly in Supabase dashboard');

    // Let's create a simple data entry guide for the user
    console.log('\n📝 MANUAL DATA ENTRY GUIDE:');
    console.log('Since RLS is blocking automated inserts, please add this data manually in your Supabase dashboard:');
    console.log('');
    console.log('USER_POINTS TABLE:');
    console.log('user_id,reward_points,activity_points');
    Object.entries(teamMembers).forEach(([role, id]) => {
      const reward = Math.floor(Math.random() * 100) + 50;
      const activity = Math.floor(Math.random() * 50) + 30;
      console.log(`${id},${reward},${activity} // ${role}`);
    });

    console.log('\n🎉 Check your dashboard now!');
    console.log('✅ Announcements, Messages, and Activity Logs are populated');
    console.log('✅ Tasks are being added (if schema allows)');
    console.log('⚠️  User points need manual entry due to RLS policies');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

populateRemainingData();