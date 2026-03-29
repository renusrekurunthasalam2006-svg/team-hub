export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
    { id: "tasks", label: "✅ Tasks", icon: "✅" },
    { id: "messages", label: "💬 Messages", icon: "💬" },
    { id: "leaderboard", label: "🏆 Leaderboard", icon: "🏆" },
    { id: "analytics", label: "📈 Analytics", icon: "📈" },
    { id: "team-members", label: "👥 Team Members", icon: "👥" }
  ];

  return (
    <aside className="sidebar">
      <h3>🚀 Team Hub</h3>
      <nav className="sidebar-menu">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
