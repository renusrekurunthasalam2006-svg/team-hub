import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/Dashboard";
import Messages from "./components/Messages";
import Tasks from "./components/Tasks";
import Leaderboard from "./components/Leaderboard";
import Analytics from "./components/Analytics";
import TeamMembers from "./components/TeamMembers";
import { supabase } from "./SupabaseClient";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connectionStatus, setConnectionStatus] = useState("checking");

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      const { data, error } = await supabase.from('tasks').select('count').limit(1);
      if (error) {
        setConnectionStatus("error");
        console.error("Supabase connection error:", error);
      } else {
        setConnectionStatus("connected");
        console.log("Supabase connected successfully");
      }
    } catch (error) {
      setConnectionStatus("error");
      console.error("Connection check failed:", error);
    }
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <header className="app-header">
          <h1>🚀 Team Manager Dashboard</h1>
          <p>Welcome to your team collaboration hub</p>
          <div className={`status-${connectionStatus}`}>
            {connectionStatus === "connected" ? "🟢 Connected" : connectionStatus === "error" ? "🔴 Connection Error" : "🟡 Checking..."}
          </div>

        </header>
        <div className="content-area">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "tasks" && <Tasks />}
          {activeTab === "messages" && <Messages />}
          {activeTab === "leaderboard" && <Leaderboard />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "team-members" && <TeamMembers />}
        </div>
      </div>
    </div>
  );
}

export default App;