import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"

export default function Dashboard() {

  const [announcements, setAnnouncements] = useState([])
  const [points, setPoints] = useState({ reward: 900, activity: 70000 })
  const [loading, setLoading] = useState(true)

  // Use a real user ID from your users object
  const userId = "70cd3b6a-4249-44c3-a134-702303389614" // Captain's ID

  // 🎯 CHOSEN DOMAINS
  const domains = [
    "Livelihood & Employment",
    "Entrepreneurship",
    "Communication & Information",
    "Information Systems",
    "Technology and Innovation - Artificial Intelligence"
  ]

  // 📋 PROJECTS
  const projects = [
    {
      id: "2026ODD413",
      title: "NetGuardian – Cloud Anomaly Detection",
      status: "Approved",
      description: "An 'immune system' for cloud infrastructure that detects botnet behavior via traffic patterns.",
      highlights: [
        "Cloud & DevOps Lead: Architecting the 'Self-Healing' infrastructure (Kubernetes/Terraform) with automated traffic re-routing",
        "ML Engineer: Building unsupervised learning models to detect anomalies in real-time network packet data",
        "Systems Architect: Designing the security orchestration logic that 'quarantines' suspicious virtual server instances automatically"
      ],
      date: "2/3/2026"
    },
    {
      id: "2026ODD410",
      title: "Smart Travel Companion: Travel Tracking, Recommendation, and Smart Trip Planning",
      status: "Approved",
      description: "Understanding people's travel behavior is essential for improving transportation planning, tourism management, and urban mobility systems.",
      highlights: [
        "Automatically tracks travel activities",
        "Helps users plan smarter and more efficient trips",
        "Integrates travel tracking, smart recommendations, and trip planning in a single system",
        "Identifies best places to visit, suitable hotels and restaurants, manages time effectively"
      ],
      date: "2/3/2026"
    },
    {
      id: "2026ODD97",
      title: "MicroCrop Hub",
      status: "Approved",
      description: "Offline Android app turns rural 10x10 rooms into ₹1L/month micro-farms",
      highlights: [
        "Room scanner calculates exact crops (microgreens/mushrooms/saffron) + 250% ROI",
        "1-tap govt schemes auto-applies PMFME (₹19k free subsidy) + MUDRA loans",
        "Verified buyers connects to Coimbatore hotels paying ₹500/kg cash weekly",
        "Java native platform earns ₹40L/year commission from 200 successful rooms"
      ],
      date: "28/2/2026"
    },
    {
      id: "2026ODD96",
      title: "AI-Based Local Business Opportunity Gap Analyzer",
      status: "Approved",
      description: "Analyzes local business density and demand patterns to guide entrepreneurs.",
      highlights: [
        "Identifies underserved business sectors in a specific locality",
        "Provides reliable local market data to reduce business failures",
        "Helps entrepreneurs make data-driven business decisions",
        "Reduces market oversaturation by identifying gaps"
      ],
      date: "28/2/2026"
    },
    {
      id: "2026ODD95",
      title: "Intelligent Entrepreneurs Support",
      status: "Approved",
      description: "A smart business guidance system that combines financial visibility, predictive risk alerts, and actionable recommendations.",
      highlights: [
        "Provides intelligent financial guidance for early-stage founders",
        "Offers financial visibility and predictive risk alerts",
        "Delivers actionable recommendations for sustainable businesses",
        "Acts as a financial decision assistant"
      ],
      date: "28/2/2026"
    }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      // Announcements
      let { data: annData, error: annError } = await supabase
        .from('announcements')
        .select('*')
      console.log('Announcements data:', annData, 'Error:', annError)
      setAnnouncements(annData || [])

      // Points
      let { data: pointData, error: pointError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
      console.log('Points data:', pointData, 'Error:', pointError)

      if (pointData && pointData.length > 0) {
        setPoints({
          reward: pointData[0].reward_points || 0,
          activity: pointData[0].activity_points || 0
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="component-card">
      <h2>📊 Dashboard</h2>

      {loading ? (
        <div>Loading dashboard data...</div>
      ) : (
        <>
          {/* POINTS */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(30,64,175,0.1)", padding: "15px", borderRadius: "8px", border: "2px solid #1e40af", flex: 1, minWidth: "200px" }}>
              <div style={{ fontSize: "0.9rem", color: "#60a5fa", marginBottom: "5px", fontWeight: 600 }}>⭐ Reward Points</div>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#93c5fd" }}>{points.reward}</div>
            </div>
            <div style={{ background: "rgba(30,64,175,0.1)", padding: "15px", borderRadius: "8px", border: "2px solid #1e40af", flex: 1, minWidth: "200px" }}>
              <div style={{ fontSize: "0.9rem", color: "#60a5fa", marginBottom: "5px", fontWeight: 600 }}>⚡ Activity Points</div>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#93c5fd" }}>{points.activity}</div>
            </div>
          </div>

          {/* CHOSEN DOMAINS */}
          <div style={{ marginTop: "25px", marginBottom: "25px" }}>
            <h3 style={{ marginBottom: "15px", color: "#60a5fa", textShadow: "0 0 10px rgba(30,64,175,0.3)" }}>🎯 Chosen Domains</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
              {domains.map((domain, idx) => (
                <div key={idx} style={{
                  background: "rgba(30,64,175,0.1)",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid rgba(30,64,175,0.3)",
                  color: "#60a5fa",
                  fontWeight: "500",
                  fontSize: "0.9rem"
                }}>
                  ✓ {domain}
                </div>
              ))}
            </div>
          </div>

          {/* PROJECTS */}
          <div style={{ marginTop: "25px", marginBottom: "25px" }}>
            <h3 style={{ marginBottom: "15px", color: "#60a5fa", textShadow: "0 0 10px rgba(30,64,175,0.3)" }}>📋 Project Details</h3>
            <div style={{ display: "grid", gap: "15px" }}>
              {projects.map((project) => (
                <div key={project.id} style={{
                  background: "rgba(30,64,175,0.08)",
                  border: "2px solid rgba(0,255,136,0.3)",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0 2px 15px rgba(0,255,136,0.2)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ color: "#00ffaa", fontSize: "0.85rem", marginBottom: "5px", fontWeight: 600 }}>📌 {project.id}</div>
                      <h4 style={{ margin: "0", fontSize: "1.1rem", color: "#60a5fa" }}>{project.title}</h4>
                    </div>
                    <span style={{
                      background: "rgba(30,64,175,0.2)",
                      color: "#60a5fa",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      marginLeft: "10px",
                      border: "1px solid rgba(30,64,175,0.5)"
                    }}>
                      ✅ {project.status}
                    </span>
                  </div>

                  <p style={{ color: "#e0e0e0", fontSize: "0.95rem", margin: "12px 0", lineHeight: "1.5" }}>
                    {project.description}
                  </p>

                  {project.highlights.length > 0 && (
                    <div style={{ background: "rgba(30,64,175,0.05)", padding: "12px", borderRadius: "6px", margin: "12px 0", border: "1px solid rgba(30,64,175,0.2)" }}>
                      <div style={{ fontWeight: "600", color: "#60a5fa", marginBottom: "8px" }}>🔍 Key Focus Areas:</div>
                      <ul style={{ margin: "0", paddingLeft: "20px" }}>
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx} style={{ color: "#e0e0e0", fontSize: "0.9rem", marginBottom: "6px", lineHeight: "1.4" }}>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ color: "#00ffaa", fontSize: "0.85rem", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(0,255,136,0.2)", fontWeight: 600 }}>
                    📅 {project.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ANNOUNCEMENTS */}
          <div style={{ marginTop: "25px" }}>
            <h3 style={{ marginBottom: "15px", color: "#60a5fa", textShadow: "0 0 10px rgba(30,64,175,0.3)" }}>📢 Announcements ({announcements.length})</h3>
            {announcements.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#00ffaa", background: "rgba(0,255,136,0.1)", borderRadius: "8px", border: "1px solid rgba(0,255,136,0.3)", fontWeight: 600 }}>
                ℹ️ No announcements available
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {announcements.map(a => (
                  <div key={a.id} style={{ 
                    background: "rgba(0,255,136,0.08)", 
                    padding: "15px", 
                    borderRadius: "8px", 
                    border: "1px solid rgba(0,255,136,0.3)",
                    boxShadow: "0 2px 15px rgba(0,255,136,0.15)",
                    borderLeft: "4px solid #60a5fa"
                  }}>
                    <div style={{ fontWeight: "bold", color: "#60a5fa", marginBottom: "5px" }}>📌 {a.title}</div>
                    <div style={{ color: "#e0e0e0", fontSize: "0.95rem" }}>{a.content}</div>
                    {a.created_at && (
                      <div style={{ color: "#00ffaa", fontSize: "0.8rem", marginTop: "8px", fontWeight: 600 }}>
                        {new Date(a.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
