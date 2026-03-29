import React, { useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient';
import './TeamMembers.css';

// Hardcoded team data as fallback
const TEAM_DATA = [
  {
    id: 'captain',
    name: 'RENUSRE K',
    email: 'renusrek.cb24@bitsathy.ac.in',
    role: 'CAPTAIN',
    contact: '8667323175',
    linkedin: 'www.linkedin.com/in/renu-sre-k-89a7a3355'
  },
  {
    id: 'vice-captain',
    name: 'MONIKA R',
    email: 'monikar.cb24@bitsathy.ac.in',
    role: 'VICE-CAPTAIN',
    contact: '9629438344',
    linkedin: 'https://www.linkedin.com/in/monikar43/'
  },
  {
    id: 'strategist',
    name: 'KARTHIESWARAN E',
    email: 'karthieswarane.cb24@bitsathy.ac.in',
    role: 'STRATEGIST',
    contact: '9363629585',
    linkedin: ''
  },
  {
    id: 'member5',
    name: 'KARTHIKA K',
    email: 'karthikak.cb24@bitsathy.ac.in',
    role: 'MEMBER 5',
    contact: '8012432050',
    linkedin: 'www.linkedin.com/in/karthika-krishnamoorthi'
  },
  {
    id: 'member8',
    name: 'SELVADHARSHINI M S',
    email: 'selvadharshinims.cs25@bitsathy.ac.in',
    role: 'MEMBER 8',
    contact: '8056116846',
    linkedin: ''
  },
  {
    id: 'member11',
    name: 'SUBHASRI M',
    email: 'subhasrim.it25@bitsathy.ac.in',
    role: 'MEMBER 11',
    contact: '8012267630',
    linkedin: ''
  },
  {
    id: 'member10',
    name: 'PRASANTH K',
    email: 'prasanthk.it25@bitsathy.ac.in',
    role: 'MEMBER 10',
    contact: '7092027123',
    linkedin: ''
  },
  {
    id: 'member9',
    name: 'RITHEESH S',
    email: 'ritheeshs.it25@bitsathy.ac.in',
    role: 'MEMBER 9',
    contact: '8248704721',
    linkedin: ''
  },
  {
    id: 'member1',
    name: 'AVANTHIKA T S',
    email: 'avanthikats.it25@bitsathy.ac.in',
    role: 'MEMBER 1',
    contact: '6381492601',
    linkedin: ''
  }
];

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useLocalData, setUseLocalData] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('role', { ascending: true });

      if (error) {
        console.log('Supabase error:', error.message);
        console.log('Using local data instead...');
        setTeamMembers(TEAM_DATA);
        setUseLocalData(true);
      } else if (data && data.length > 0) {
        setTeamMembers(data);
        setUseLocalData(false);
      } else {
        // No data from Supabase, use local
        console.log('No data from Supabase, using local data');
        setTeamMembers(TEAM_DATA);
        setUseLocalData(true);
      }
    } catch (err) {
      console.error('Error:', err);
      // Use local data on error
      setTeamMembers(TEAM_DATA);
      setUseLocalData(true);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role.toUpperCase()) {
      case 'CAPTAIN':
        return '#60a5fa'; // Light blue
      case 'VICE-CAPTAIN':
        return '#3b82f6'; // Medium blue
      case 'STRATEGIST':
        return '#1e40af'; // Dark blue
      default:
        return '#6b7280'; // Grey for members
    }
  };

  const getRoleIcon = (role) => {
    switch (role.toUpperCase()) {
      case 'CAPTAIN':
        return '👑';
      case 'VICE-CAPTAIN':
        return '⭐';
      case 'STRATEGIST':
        return '🎯';
      default:
        return '👥';
    }
  };

  if (loading) {
    return (
      <div className="team-members-container">
        <h2>Team Members</h2>
        <div className="loading">Loading team members...</div>
      </div>
    );
  }

  if (error && !useLocalData) {
    return (
      <div className="team-members-container">
        <h2>Team Members</h2>
        <div className="error">
          <p>⚠️ {error}</p>
          <button onClick={fetchTeamMembers} className="retry-btn" style={{ marginTop: '15px' }}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="team-members-container">
      <h2>Team Members</h2>
      
      {useLocalData && (
        <div style={{ background: 'rgba(30,64,175,0.15)', border: '1px solid rgba(30,64,175,0.4)', padding: '12px', borderRadius: '5px', marginBottom: '20px', fontSize: '0.9rem', color: '#60a5fa' }}>
          ℹ️ Showing local team data. Database sync will resume when connection is available.
        </div>
      )}

      <div className="team-stats">
        <div className="stat-item">
          <span className="stat-number">{teamMembers.length}</span>
          <span className="stat-label">Total Members</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {teamMembers.filter(m => m.role && m.role.includes('MEMBER')).length}
          </span>
          <span className="stat-label">Team Members</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {teamMembers.filter(m => m.role && !m.role.includes('MEMBER')).length}
          </span>
          <span className="stat-label">Leadership</span>
        </div>
      </div>

      <div className="team-members-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className="member-card">
            <div className="member-header">
              <div
                className="role-badge"
                style={{ backgroundColor: getRoleColor(member.role) }}
              >
                {getRoleIcon(member.role)} {member.role}
              </div>
            </div>

            <div className="member-avatar">
              <div className="avatar-placeholder">
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            </div>

            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-email">{member.email}</p>

              {member.contact && (
                <div className="contact-info">
                  <span className="contact-icon">📱</span>
                  <span>{member.contact}</span>
                </div>
              )}

              {member.linkedin && (
                <div className="linkedin-info">
                  <span className="linkedin-icon">💼</span>
                  <a
                    href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-link"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="no-members">
          <p>No team members found.</p>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;