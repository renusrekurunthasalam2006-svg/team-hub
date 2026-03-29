import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"
import "./Messages.css"

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState("")
  const [currentUser, setCurrentUser] = useState("")
  const [currentUserRole, setCurrentUserRole] = useState("")
  const [receiverId, setReceiverId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 🧠 TEAM MEMBERS WITH ROLES
  const teamMembers = {
    captain: { id: "70cd3b6a-4249-44c3-a134-702303389614", name: "RENUSRE K (Captain)", role: "captain" },
    vice_captain: { id: "1b3a7002-44c8-4a1c-840e-8d2afd4bdf3a", name: "MONIKA R (Vice Captain)", role: "vice_captain" },
    strategist: { id: "b15ae88c-468b-4b65-b093-e7cd3edeb2a3", name: "KARTHIESWARAN E (Strategist)", role: "strategist" },
    member1: { id: "b15ae88c-468b-4b65-b093-e7cd3edeb2a3", name: "AVANTHIKA T S (Member 1)", role: "member" },
    member5: { id: "0b5802b2-be7a-4007-b9b1-511bd2d405d2", name: "KARTHIKA K (Member 5)", role: "member" },
    member8: { id: "8fdc30fc-1c46-4cb7-bfe8-912c73fe776d", name: "SELVADHARSHINI M S (Member 8)", role: "member" },
    member9: { id: "4f81d463-185c-4b30-9412-3c36caa18ee4", name: "RITHEESH S (Member 9)", role: "member" },
    member10: { id: "7146a587-16dc-467c-87d6-3e2164ef99e8", name: "PRASANTH K (Member 10)", role: "member" },
    member11: { id: "da278fd4-9090-4eba-93a7-7d6b9e48957b", name: "SUBHASRI M (Member 11)", role: "member" }
  }

  // ✅ ALLOWED SENDERS: Captain, Vice Captain, Strategist, and Members
  const senderOptions = [
    teamMembers.captain,
    teamMembers.vice_captain,
    teamMembers.strategist,
    teamMembers.member1,
    teamMembers.member5,
    teamMembers.member8,
    teamMembers.member9,
    teamMembers.member10,
    teamMembers.member11
  ]

  // ✅ ALLOWED RECEIVERS: Captain, Vice Captain, Strategist only
  const receiverOptions = [
    teamMembers.captain,
    teamMembers.vice_captain,
    teamMembers.strategist
  ]

  useEffect(() => {
    // Fetch all messages on component load (regardless of currentUser)
    fetchAllMessages()
  }, [])

  // 📥 FETCH ALL MESSAGES (on page load)
  async function fetchAllMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
        setMessages([])
      } else {
        setMessages(data || [])
      }
    } catch (err) {
      console.error('Error in fetchAllMessages:', err)
      setMessages([])
    }
  }

  useEffect(() => {
    // Filter messages based on selected sender
    if (currentUser) {
      displayMessagesForUser()
    }
  }, [currentUser])

  // 📥 FILTER MESSAGES FOR CURRENT USER (when sender is selected)
  function displayMessagesForUser() {
    const filtered = messages.filter(msg => 
      msg.sender_id === currentUser || msg.receiver_id === currentUser
    )
    // Messages are already loaded, so no need to refetch - just display filtered
  }

  // 📥 FETCH MESSAGES
  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUser},receiver_id.eq.${currentUser}`)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
        setMessages([])
      } else {
        setMessages(data || [])
      }
    } catch (err) {
      console.error('Error in fetchMessages:', err)
      setMessages([])
    }
  }

  // 📤 SEND MESSAGE
  async function sendMessage() {
    setError("")

    // Validation
    if (!messageText.trim()) {
      setError("Message cannot be empty")
      return
    }

    if (!currentUser) {
      setError("Please select a sender")
      return
    }

    if (!receiverId) {
      setError("Please select a receiver")
      return
    }

    if (currentUser === receiverId) {
      setError("You cannot send a message to yourself")
      return
    }

    // Validate that receiver is from allowed list
    const receiverAllowed = receiverOptions.some(r => r.id === receiverId)
    if (!receiverAllowed) {
      setError("Invalid receiver selected. Messages can only be sent to Captain, Vice Captain, or Strategist")
      return
    }

    setLoading(true)
    try {
      const { error: insertError } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: currentUser,
            receiver_id: receiverId,
            message: messageText.trim()
          }
        ])

      if (insertError) {
        console.error('Insert error:', insertError)
        setError(insertError.message || "Failed to send message")
      } else {
        setMessageText("")
        setError("")
        fetchAllMessages() // Refresh all messages
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err.message || "Error sending message")
    } finally {
      setLoading(false)
    }
  }

  // Get member name by ID
  const getMemberName = (userId) => {
    for (const member of Object.values(teamMembers)) {
      if (member.id === userId) return member.name
    }
    return "Unknown"
  }

  return (
    <div className="component-card">
      <h2>💬 Team Messages</h2>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '5px',
          marginBottom: '15px',
          border: '1px solid #f5c6cb'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* SENDER SELECTION */}
      <div className="message-form-group">
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          👤 Select Sender (Who is sending):
        </label>
        <select 
          value={currentUser} 
          onChange={(e) => {
            setCurrentUser(e.target.value)
            const selected = senderOptions.find(s => s.id === e.target.value)
            setCurrentUserRole(selected?.role || "")
          }}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem'
          }}
        >
          <option value="">-- Select Sender --</option>
          {senderOptions.map(member => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        <small style={{ color: '#60a5fa', display: 'block', marginTop: '5px', fontWeight: 600 }}>
          ℹ️ Only Captain, Vice Captain, Strategist, and Members can send messages
        </small>
      </div>

      {/* RECEIVER SELECTION */}
      <div className="message-form-group">
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          📨 Select Receiver (Who receives):
        </label>
        <select 
          value={receiverId} 
          onChange={(e) => setReceiverId(e.target.value)}
          disabled={!currentUser}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            opacity: !currentUser ? 0.5 : 1,
            cursor: !currentUser ? 'not-allowed' : 'pointer'
          }}
        >
          <option value="">-- Select Receiver --</option>
          {receiverOptions.map(member => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
          ℹ️ Messages can only be sent to Captain, Vice Captain, or Strategist
        </small>
      </div>

      {/* MESSAGE INPUT */}
      <div className="message-form-group">
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          ✉️ Message:
        </label>
        <textarea
          placeholder="Type your message here..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={!currentUser || !receiverId}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            fontFamily: 'inherit',
            minHeight: '100px',
            resize: 'vertical',
            opacity: !currentUser || !receiverId ? 0.5 : 1
          }}
        />
      </div>

      {/* SEND BUTTON */}
      <button 
        onClick={sendMessage}
        disabled={loading || !currentUser || !receiverId || !messageText.trim()}
        style={{
          width: '100%',
          padding: '12px',
          background: loading || !currentUser || !receiverId || !messageText.trim() ? '#ccc' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: loading || !currentUser || !receiverId || !messageText.trim() ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? '📤 Sending...' : '📤 Send Message'}
      </button>

      {/* MESSAGES DISPLAY */}
      <div>
        <h3>📬 Message Thread ({currentUser ? messages.filter(msg => msg.sender_id === currentUser || msg.receiver_id === currentUser).length : 0})</h3>
        <div style={{
          marginTop: '10px',
          border: '2px solid rgba(0,255,136,0.3)',
          padding: '15px',
          minHeight: '300px',
          maxHeight: '500px',
          overflowY: 'auto',
          background: 'rgba(0,255,136,0.05)',
          borderRadius: '8px'
        }}>
          {!currentUser ? (
            <p style={{ textAlign: 'center', color: '#60a5fa', marginTop: '100px', fontWeight: 600 }}>
              👤 Select a sender to view messages
            </p>
          ) : messages.filter(msg => msg.sender_id === currentUser || msg.receiver_id === currentUser).length === 0 ? (
            <p style={{ textAlign: "center", color: "#60a5fa", marginTop: "100px", fontWeight: 600 }}>
              📭 No messages yet. Start the conversation!
            </p>
          ) : (
            messages.filter(msg => msg.sender_id === currentUser || msg.receiver_id === currentUser).map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '12px',
                  padding: '12px',
                  background: msg.sender_id === currentUser ? 'rgba(0,255,136,0.1)' : 'rgba(0,255,255,0.1)',
                  borderLeft: msg.sender_id === currentUser ? '4px solid #60a5fa' : '4px solid #3b82f6',
                  borderRadius: '5px',
                  wordWrap: 'break-word'
                }}
              >
                <div style={{
                  fontSize: '0.85rem',
                  color: '#60a5fa',
                  marginBottom: '6px',
                  fontWeight: 'bold'
                }}>
                  {msg.sender_id === currentUser ? '👤 You' : `📨 ${getMemberName(msg.sender_id)}`}
                  <span style={{ marginLeft: '15px', fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600 }}>
                    → {getMemberName(msg.receiver_id)}
                  </span>
                </div>
                <div style={{ fontSize: '1rem', color: '#e0e0e0', marginBottom: '6px' }}>
                  {msg.message}
                </div>
                {msg.created_at && (
                  <div style={{ fontSize: '0.75rem', color: '#00ffaa' }}>
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* INFO MESSAGE */}
      {currentUser && (
        <div style={{
          marginTop: '15px',
          background: 'rgba(0,255,136,0.1)',
          padding: '12px',
          borderRadius: '5px',
          fontSize: '0.9rem',
          color: '#60a5fa',
          border: '1px solid rgba(0,255,136,0.5)',
          fontWeight: 600
        }}>
          ℹ️ Current sender: <strong>{getMemberName(currentUser)}</strong>
          {receiverId && (
            <>
              <br />
              📨 Receiver: <strong>{getMemberName(receiverId)}</strong>
            </>
          )}
        </div>
      )}
    </div>
  )
}
