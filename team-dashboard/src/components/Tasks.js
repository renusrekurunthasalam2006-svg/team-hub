import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  // 📋 TEAM TASKS WITH YOUR DATA
  const defaultTasks = [
    { id: 1, title: "GP Challenge Completion", status: "pending", priority: "high", created_at: new Date().toISOString() },
    { id: 2, title: "Learning Basic Languages", description: "HTML, CSS, JavaScript, React, Node, Backend Code", status: "pending", priority: "high", created_at: new Date().toISOString() },
    { id: 3, title: "Project Status", status: "pending", priority: "medium", created_at: new Date().toISOString() },
    { id: 4, title: "Problem Statement Selection and Presentation", status: "completed", priority: "high", created_at: new Date().toISOString() }
  ]

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    setLoading(true)
    try {
      let { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      console.log('Tasks data:', data, 'Error:', error)
      // Use defaultTasks if database is empty, otherwise use database tasks
      setTasks(data && data.length > 0 ? data : defaultTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
      setTasks(defaultTasks)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="component-card">
      <h2>✅ Tasks</h2>

      {loading ? (
        <div>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px" }}>
            {tasks.map(t => (
              <div key={t.id} style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <h4 style={{ margin: "0", color: "#2c3e50", fontSize: "1.1rem", flex: 1 }}>{t.title}</h4>
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    background: t.status === 'completed' ? '#d4edda' : t.status === 'in_progress' ? '#fff3cd' : '#f8d7da',
                    color: t.status === 'completed' ? '#155724' : t.status === 'in_progress' ? '#856404' : '#721c24',
                    marginLeft: "10px",
                    whiteSpace: "nowrap"
                  }}>
                    {t.status === 'completed' ? '✅ Completed' : t.status === 'in_progress' ? '⏳ In Progress' : '⏯️ Pending'}
                  </span>
                </div>

                {t.description && (
                  <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "0.9rem" }}>📝 {t.description}</p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#666", marginBottom: "12px" }}>
                  {t.priority && (
                    <div>🚨 <strong>Priority:</strong> <span style={{ 
                      textTransform: "capitalize",
                      fontWeight: t.priority === 'high' ? '600' : '400',
                      color: t.priority === 'high' ? '#dc3545' : t.priority === 'medium' ? '#ffc107' : '#28a745'
                    }}>{t.priority}</span></div>
                  )}
                  {t.assigned_to && (
                    <div>👤 <strong>Assigned to:</strong> {t.assigned_to}</div>
                  )}
                  {t.due_date && (
                    <div>📅 <strong>Due:</strong> {new Date(t.due_date).toLocaleDateString()}</div>
                  )}
                </div>

                {t.status !== 'completed' && (
                  <button
                    onClick={() => completeTask(t.id)}
                    style={{
                      marginTop: "15px",
                      padding: "10px 16px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      width: "100%",
                      transition: "background 0.3s ease"
                    }}
                    onMouseOver={(e) => e.target.style.background = "#218838"}
                    onMouseOut={(e) => e.target.style.background = "#28a745"}
                  >
                    Mark as Complete ✅
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Task Summary */}
          <div style={{ marginTop: "30px", padding: "20px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "8px", color: "white" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "white", fontSize: "1.2rem" }}>📊 Task Summary</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px" }}>
              <div style={{ textAlign: "center", padding: "15px", background: "rgba(255,255,255,0.15)", borderRadius: "8px" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Completed</div>
              </div>
              <div style={{ textAlign: "center", padding: "15px", background: "rgba(255,255,255,0.15)", borderRadius: "8px" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {tasks.filter(t => t.status === 'in_progress').length}
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>In Progress</div>
              </div>
              <div style={{ textAlign: "center", padding: "15px", background: "rgba(255,255,255,0.15)", borderRadius: "8px" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {tasks.filter(t => !t.status || t.status === 'pending').length}
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Pending</div>
              </div>
              <div style={{ textAlign: "center", padding: "15px", background: "rgba(255,255,255,0.15)", borderRadius: "8px" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {tasks.length}
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Total</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  async function completeTask(taskId) {
    try {
      // Update in database
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', taskId)

      if (!error || error?.message.includes('No rows found')) {
        // Update local state
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t))
      } else {
        console.error('Error completing task:', error)
      }
    } catch (error) {
      console.error('Error in completeTask:', error)
    }
  }
}
