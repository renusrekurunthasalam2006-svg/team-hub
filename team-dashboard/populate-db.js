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

async function populateDatabase() {
  console.log('🚀 Populating Supabase database with sample team data...\n');

  try {
    // 1. Populate user_points table
    console.log('📊 Adding user points data...');
    const userPointsData = [
      { user_id: teamMembers.captain, reward_points: 150, activity_points: 85 },
      { user_id: teamMembers.vice_captain, reward_points: 120, activity_points: 95 },
      { user_id: teamMembers.member1, reward_points: 95, activity_points: 70 },
      { user_id: teamMembers.member5, reward_points: 110, activity_points: 80 },
      { user_id: teamMembers.member8, reward_points: 85, activity_points: 65 },
      { user_id: teamMembers.member9, reward_points: 75, activity_points: 60 },
      { user_id: teamMembers.member10, reward_points: 90, activity_points: 75 },
      { user_id: teamMembers.member11, reward_points: 80, activity_points: 55 }
    ];

    for (const points of userPointsData) {
      const { error } = await supabase.from('user_points').insert(points);
      if (error) console.log(`❌ Error adding points for ${points.user_id}:`, error.message);
    }
    console.log('✅ User points data added\n');

    // 2. Populate tasks table
    console.log('📋 Adding tasks data...');
    const tasksData = [
      {
        title: "Complete Project Documentation",
        description: "Write comprehensive documentation for the team project",
        status: "completed",
        assigned_to: teamMembers.captain,
        priority: "high",
        due_date: "2026-03-30"
      },
      {
        title: "Code Review Session",
        description: "Review pull requests and provide feedback",
        status: "in_progress",
        assigned_to: teamMembers.vice_captain,
        priority: "medium",
        due_date: "2026-03-29"
      },
      {
        title: "Database Optimization",
        description: "Optimize database queries for better performance",
        status: "pending",
        assigned_to: teamMembers.member1,
        priority: "high",
        due_date: "2026-04-01"
      },
      {
        title: "UI/UX Design Updates",
        description: "Update the user interface based on feedback",
        status: "completed",
        assigned_to: teamMembers.member5,
        priority: "medium",
        due_date: "2026-03-25"
      },
      {
        title: "Testing Framework Setup",
        description: "Set up automated testing framework",
        status: "in_progress",
        assigned_to: teamMembers.member8,
        priority: "high",
        due_date: "2026-03-31"
      },
      {
        title: "API Documentation",
        description: "Document all API endpoints",
        status: "pending",
        assigned_to: teamMembers.member9,
        priority: "low",
        due_date: "2026-04-05"
      },
      {
        title: "Security Audit",
        description: "Perform security audit on the application",
        status: "completed",
        assigned_to: teamMembers.member10,
        priority: "high",
        due_date: "2026-03-28"
      },
      {
        title: "Performance Monitoring",
        description: "Set up performance monitoring tools",
        status: "pending",
        assigned_to: teamMembers.member11,
        priority: "medium",
        due_date: "2026-04-02"
      }
    ];

    for (const task of tasksData) {
      const { error } = await supabase.from('tasks').insert(task);
      if (error) console.log(`❌ Error adding task "${task.title}":`, error.message);
    }
    console.log('✅ Tasks data added\n');

    // 3. Populate announcements table
    console.log('📢 Adding announcements data...');
    const announcementsData = [
      {
        title: "Team Meeting Tomorrow",
        content: "Don't forget our weekly team meeting at 10 AM tomorrow. We'll discuss project progress and upcoming deadlines.",
        created_by: teamMembers.captain
      },
      {
        title: "New Project Kickoff",
        content: "Exciting news! We're starting a new project next week. More details will be shared in the next team meeting.",
        created_by: teamMembers.vice_captain
      },
      {
        title: "Holiday Schedule Update",
        content: "Please update your holiday schedules in the HR system by end of this week for April planning.",
        created_by: teamMembers.captain
      },
      {
        title: "Congratulations to the Team!",
        content: "Great job everyone! We successfully completed the Q1 objectives ahead of schedule. Let's keep up the momentum!",
        created_by: teamMembers.vice_captain
      }
    ];

    for (const announcement of announcementsData) {
      const { error } = await supabase.from('announcements').insert(announcement);
      if (error) console.log(`❌ Error adding announcement "${announcement.title}":`, error.message);
    }
    console.log('✅ Announcements data added\n');

    // 4. Add more messages for better demo
    console.log('💬 Adding more messages...');
    const messagesData = [
      {
        sender_id: teamMembers.vice_captain,
        receiver_id: teamMembers.captain,
        message: "Captain, the code review is going well. Found a few minor issues that need attention."
      },
      {
        sender_id: teamMembers.member1,
        receiver_id: teamMembers.captain,
        message: "Database optimization task is 70% complete. Should be done by tomorrow."
      },
      {
        sender_id: teamMembers.captain,
        receiver_id: teamMembers.member5,
        message: "Great work on the UI updates! The new design looks fantastic."
      },
      {
        sender_id: teamMembers.member8,
        receiver_id: teamMembers.vice_captain,
        message: "Testing framework is set up. Ready for your review when you have time."
      }
    ];

    for (const message of messagesData) {
      const { error } = await supabase.from('messages').insert(message);
      if (error) console.log(`❌ Error adding message:`, error.message);
    }
    console.log('✅ Additional messages added\n');

    // 5. Populate activity_log table
    console.log('📝 Adding activity log data...');
    const activityLogData = [
      { user_id: teamMembers.captain, activity_type: "task_completed", points: 25 },
      { user_id: teamMembers.vice_captain, activity_type: "task_completed", points: 20 },
      { user_id: teamMembers.member5, activity_type: "task_completed", points: 15 },
      { user_id: teamMembers.member10, activity_type: "task_completed", points: 30 },
      { user_id: teamMembers.member1, activity_type: "task_completed", points: 18 },
      { user_id: teamMembers.member8, activity_type: "task_completed", points: 22 }
    ];

    for (const activity of activityLogData) {
      const { error } = await supabase.from('activity_log').insert(activity);
      if (error) console.log(`❌ Error adding activity log:`, error.message);
    }
    console.log('✅ Activity log data added\n');

    console.log('🎉 Database population complete!');
    console.log('📊 Your dashboard should now show rich data visualizations.');
    console.log('🔄 Refresh your browser to see the updated analytics!');

  } catch (error) {
    console.log('❌ Error populating database:', error.message);
  }
}

populateDatabase();