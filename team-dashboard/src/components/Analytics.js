import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

export default function Analytics() {
  const [userPoints, setUserPoints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  async function fetchAnalyticsData() {
    setLoading(true);
    try {
      // Fetch user points data
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .order('reward_points', { ascending: false });

      console.log('Analytics - User Points:', pointsData, 'Error:', pointsError);

      // Fetch tasks data
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*');

      console.log('Analytics - Tasks:', tasksData, 'Error:', tasksError);

      // Set data with null safety
      setUserPoints(pointsData || []);
      setTasks(tasksData || []);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Set empty arrays on error to prevent crashes
      setUserPoints([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  // Prepare data for reward points chart (top 10)
  const rewardPointsData = (userPoints || [])
    .slice(0, 10)
    .map((user, index) => ({
      name: user?.user_id ? `Member ${user.user_id.slice(0, 8)}...` : `Member ${index + 1}`,
      reward: user?.reward_points || 0,
      activity: user?.activity_points || 0,
      rank: index + 1
    }));

  // Prepare data for task status pie chart
  const taskStatusData = [
    { name: 'Completed', value: (tasks || []).filter(t => t?.status === 'completed').length, color: '#10b981' },
    { name: 'Pending', value: (tasks || []).filter(t => t?.status !== 'completed').length, color: '#f59e0b' }
  ];

  // Prepare data for team performance line chart
  const teamPerformanceData = (userPoints || [])
    .slice(0, 5)
    .map((user, idx) => ({
      member: user?.user_id && typeof user.user_id === 'string' ? `Member ${user.user_id.slice(0, 8)}...` : `Member ${idx + 1}`,
      reward: user?.reward_points || 0,
      activity: user?.activity_points || 0
    }));

  const COLORS = ['#60a5fa', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  if (loading) {
    return (
      <div className="component-card">
        <h2>📊 Team Analytics</h2>
        <div>Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="component-card">
      <h2>📊 Team Analytics Dashboard</h2>

      {/* Top Performers - Reward Points */}
      <div style={{ marginBottom: "40px" }}>
        <h3>🏆 Top Performers by Reward Points</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rewardPointsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reward" fill="#60a5fa" name="Reward Points" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Performers - Activity Points */}
      <div style={{ marginBottom: "40px" }}>
        <h3>⚡ Top Performers by Activity Points</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rewardPointsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="activity" fill="#3b82f6" name="Activity Points" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Task Completion Status */}
      <div style={{ marginBottom: "40px" }}>
        <h3>📋 Task Completion Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={taskStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#10b981"
              dataKey="value"
            >
              {taskStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Team Performance Comparison */}
      <div style={{ marginBottom: "40px" }}>
        <h3>📈 Team Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={teamPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="member" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="reward" stroke="#60a5fa" strokeWidth={3} name="Reward Points" />
            <Line type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={3} name="Activity Points" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Statistics */}
      <div style={{ marginBottom: "20px" }}>
        <h3>📊 Detailed Statistics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          <div style={{ background: "rgba(0,255,136,0.1)", padding: "20px", borderRadius: "8px", textAlign: "center", border: "2px solid rgba(0,255,136,0.3)" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#60a5fa" }}>Total Members</h4>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#93c5fd" }}>{(userPoints || []).length}</div>
          </div>
          <div style={{ background: "rgba(0,255,136,0.1)", padding: "20px", borderRadius: "8px", textAlign: "center", border: "2px solid rgba(0,255,136,0.3)" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#60a5fa" }}>Total Tasks</h4>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#93c5fd" }}>{(tasks || []).length}</div>
          </div>
          <div style={{ background: "rgba(255,170,0,0.1)", padding: "20px", borderRadius: "8px", textAlign: "center", border: "2px solid rgba(255,170,0,0.3)" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#10b981" }}>Completed Tasks</h4>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff6600" }}>
              {(tasks || []).filter(t => t?.status === 'completed').length}
            </div>
          </div>
          <div style={{ background: "rgba(255,0,128,0.1)", padding: "20px", borderRadius: "8px", textAlign: "center", border: "2px solid rgba(255,0,128,0.3)" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#60a5fa" }}>Avg Reward Points</h4>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff4500" }}>
              {(userPoints || []).length > 0 ? Math.round((userPoints || []).reduce((sum, user) => sum + (user?.reward_points || 0), 0) / (userPoints || []).length) : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div>
        <h3>🥇 Top 5 Performers</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ background: "rgba(0,255,136,0.2)", borderBottom: "2px solid rgba(0,255,136,0.5)" }}>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid rgba(30,64,175,0.3)", color: "#60a5fa", fontWeight: "bold" }}>Rank</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid rgba(30,64,175,0.3)", color: "#60a5fa", fontWeight: "bold" }}>Member ID</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid rgba(30,64,175,0.3)", color: "#60a5fa", fontWeight: "bold" }}>Reward Points</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid rgba(30,64,175,0.3)", color: "#60a5fa", fontWeight: "bold" }}>Activity Points</th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid rgba(30,64,175,0.3)", color: "#60a5fa", fontWeight: "bold" }}>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {(userPoints || []).slice(0, 5).map((user, index) => (
                <tr key={user?.id || index} style={{ background: index % 2 === 0 ? "rgba(30,64,175,0.05)" : "rgba(30,64,175,0.08)", borderBottom: "1px solid rgba(30,64,175,0.2)" }}>
                  <td style={{ padding: "12px", border: "1px solid rgba(30,64,175,0.2)", fontWeight: "bold", color: "#60a5fa" }}>
                    #{index + 1}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid rgba(30,64,175,0.2)", color: "#93c5fd" }}>
                    {user?.user_id && typeof user.user_id === 'string' ? user.user_id.slice(0, 12) : 'N/A'}...
                  </td>
                  <td style={{ padding: "12px", border: "1px solid rgba(30,64,175,0.2)", fontWeight: "bold", color: "#60a5fa" }}>
                    {user?.reward_points || 0} ⭐
                  </td>
                  <td style={{ padding: "12px", border: "1px solid rgba(30,64,175,0.2)", fontWeight: "bold", color: "#3b82f6" }}>
                    {user?.activity_points || 0} ⚡
                  </td>
                  <td style={{ padding: "12px", border: "1px solid rgba(30,64,175,0.2)", fontWeight: "bold", color: "#60a5fa" }}>
                    {(user?.reward_points || 0) + (user?.activity_points || 0)} 🎯
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}