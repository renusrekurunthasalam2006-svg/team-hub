import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"

export default function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [points, setPoints] = useState({ reward: 0, activity: 0 })

  const userId = "USER_ID_HERE" // replace later

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {

    // Tasks
    let { data: taskData } = await supabase
      .from('tasks')
      .select('*')
    setTasks(taskData)

    // Announcements
    let { data: annData } = await supabase
      .from('announcements')
      .select('*')
    setAnnouncements(annData)

    // Points
    let { data: pointData } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)

    if (pointData.length > 0) {
      setPoints({
        reward: pointData[0].reward_points,
        activity: pointData[0].activity_points
      })
    }
  }

  return (
    <div style={{ padding: "20px", flex: 1 }}>

      <h2>Dashboard</h2>

      {/* POINTS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div>⭐ Reward Points: {points.reward}</div>
        <div>⚡ Activity Points: {points.activity}</div>
      </div>

      {/* ANNOUNCEMENTS */}
      <h3>Announcements</h3>
      {announcements.map(a => (
        <div key={a.id}>
          <b>{a.title}</b> - {a.content}
        </div>
      ))}

      {/* TASKS */}
      <h3>Tasks</h3>
      {tasks.map(t => (
        <div key={t.id}>
          {t.title} - {t.status}
          <button onClick={() => completeTask(t.id)}>Complete</button>
        </div>
      ))}

    </div>
  )

  async function completeTask(taskId) {

    // update task
    await supabase
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', taskId)

    // add points
    await supabase
      .from('user_points')
      .update({
        reward_points: points.reward + 10,
        activity_points: points.activity + 5
      })
      .eq('user_id', userId)

    // log activity
    await supabase.from('activity_log').insert([
      {
        user_id: userId,
        activity_type: "task_completed",
        points: 10
      }
    ])

    fetchData()
  }
}