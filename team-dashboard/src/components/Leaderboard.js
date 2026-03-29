import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"

export default function Leaderboard() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {
    setLoading(true)
    try {
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .order('activity_points', { ascending: false })
        .order('reward_points', { ascending: false })

      if (pointsError) {
        console.error('Leaderboard points error:', pointsError)
        setUsers([])
        return
      }

      const userIds = (pointsData || [])
        .map((item) => item.user_id)
        .filter(Boolean)

      let nameMap = {}
      if (userIds.length > 0) {
        const { data: membersData, error: membersError } = await supabase
          .from('team_members')
          .select('user_id,name')
          .in('user_id', userIds)

        if (!membersError && membersData) {
          nameMap = membersData.reduce((acc, cur) => {
            acc[cur.user_id] = cur.name
            return acc
          }, {})
        } else if (membersError) {
          console.warn('Could not load team member names:', membersError)
        }
      }

      const usersWithName = (pointsData || []).map((item) => ({
        ...item,
        display_name: nameMap[item.user_id] || item.name || item.full_name || item.display_name || item.nickname || null
      }))

      setUsers(usersWithName)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="component-card">
      <h2>🏆 Leaderboard</h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((u, i) => (
          <div key={u.id} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            margin: "12px 0",
            background: i === 0 ? "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)" : i === 1 ? "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)" : i === 2 ? "linear-gradient(135deg, #cd7f32 0%, #d2b48c 100%)" : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            borderRadius: "15px",
            border: `2px solid ${i < 3 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: i < 3 ? '0 8px 25px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            transform: i < 3 ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: i < 3 ? "#ffffff" : "#60a5fa",
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                background: i < 3 ? 'rgba(255,255,255,0.2)' : 'rgba(0,255,136,0.2)',
                padding: '5px 10px',
                borderRadius: '50%',
                border: `2px solid ${i < 3 ? 'rgba(255,255,255,0.5)' : 'rgba(0,255,136,0.5)'}`
              }}>
                #{i + 1}
              </span>
              <span style={{ fontWeight: "600", color: "#ffffff", fontSize: "1.1rem" }}>
                {u.display_name || (u.user_id ? `User ${u.user_id.slice(0, 8)}...` : 'Unknown User')}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#60a5fa", textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {u.activity_points || 0} ⚡
              </div>
              <div style={{ fontSize: "1rem", color: "#60a5fa", fontWeight: "500" }}>
                {u.reward_points || 0} ⭐
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
