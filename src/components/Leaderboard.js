import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"

export default function Leaderboard() {

  const [users, setUsers] = useState([])

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {
    let { data } = await supabase
      .from('user_points')
      .select('*')
      .order('reward_points', { ascending: false })

    setUsers(data)
  }

  return (
    <div>
      <h3>Leaderboard</h3>
      {users.map((u, i) => (
        <div key={u.id}>
          #{i + 1} - {u.reward_points} pts
        </div>
      ))}
    </div>
  )
}