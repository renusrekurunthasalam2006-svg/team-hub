import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"

export default function Messages() {

  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [currentUser, setCurrentUser] = useState("")
  const [receiverId, setReceiverId] = useState("")

  // 🧠 USERS (Your real UUIDs)
  const users = {
    captain: "70cd3b6a-4249-44c3-a134-702303389614",
    vice_captain: "1b3a7002-44c8-4a1c-840e-8d2afd4bdf3a",
    member1: "b15ae88c-468b-4b65-b093-e7cd3edeb2a3",
    member5: "0b5802b2-be7a-4007-b9b1-511bd2d405d2",
    member8: "8fdc30fc-1c46-4cb7-bfe8-912c73fe776d",
    member9: "4f81d463-185c-4b30-9412-3c36caa18ee4",
    member10: "7146a587-16dc-467c-87d6-3e2164ef99e8",
    member11: "da278fd4-9090-4eba-93a7-7d6b9e48957b"
  }

  useEffect(() => {
    if (currentUser) {
      fetchMessages()
    }
  }, [currentUser])

  // 📥 FETCH MESSAGES
  async function fetchMessages() {
    let { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUser},receiver_id.eq.${currentUser}`)
      .order('created_at', { ascending: true })

    if (!error) setMessages(data)
  }

  // 📤 SEND MESSAGE
  async function sendMessage() {

    if (!text || !currentUser || !receiverId) {
      alert("Select sender and receiver!")
      return
    }

    if (currentUser === receiverId) {
      alert("You cannot send message to yourself")
      return
    }

    await supabase.from('messages').insert([
      {
        sender_id: currentUser,
        receiver_id: receiverId,
        message: text
      }
    ])

    setText("")
    fetchMessages()
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Messages</h2>

      {/* 🧑 SELECT CURRENT USER */}
      <div>
        <label>Select Sender: </label>
        <select onChange={(e) => setCurrentUser(e.target.value)}>
          <option value="">--Select--</option>
          <option value={users.captain}>Captain</option>
          <option value={users.vice_captain}>Vice Captain</option>
          <option value={users.member1}>Member 1</option>
          <option value={users.member5}>Member 5</option>
          <option value={users.member8}>Member 8</option>
          <option value={users.member9}>Member 9</option>
          <option value={users.member10}>Member 10</option>
          <option value={users.member11}>Member 11</option>
        </select>
      </div>

      {/* 🎯 SELECT RECEIVER */}
      <div>
        <label>Select Receiver: </label>
        <select onChange={(e) => setReceiverId(e.target.value)}>
          <option value="">--Select--</option>
          <option value={users.captain}>Captain</option>
          <option value={users.vice_captain}>Vice Captain</option>
          <option value={users.member1}>Member 1</option>
          <option value={users.member5}>Member 5</option>
          <option value={users.member8}>Member 8</option>
          <option value={users.member9}>Member 9</option>
          <option value={users.member10}>Member 10</option>
          <option value={users.member11}>Member 11</option>
        </select>
      </div>

      <br />

      {/* 💬 MESSAGE LIST */}
      <div style={{
        border: "1px solid gray",
        padding: "10px",
        height: "200px",
        overflowY: "scroll"
      }}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <b>{msg.sender_id === currentUser ? "You" : "Other"}:</b> {msg.message}
          </div>
        ))}
      </div>

      <br />

      {/* ✍️ INPUT */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  )
}