import React, { useState, useEffect } from "react";
import "../../styles/admindasboard.css";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      alert("Could not load messages. See console.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId, memberId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/messages/${memberId}/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to delete message");
      
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      alert("Message deleted successfully");
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Could not delete message");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#64748b'
      }}>
        <div style={{
          width: '30px',
          height: '30px',
          border: '2px solid #e2e8f0',
          borderTop: '2px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        Loading messages...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#64748b'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
        <div>No messages sent yet</div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <h4>Sent Messages ({messages.length})</h4>
      <div style={{ 
        maxHeight: '400px', 
        overflowY: 'auto',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem'
      }}>
        {messages.map((message) => (
          <div 
            key={`${message.memberId}-${message._id}`}
            style={{
              padding: '1rem',
              borderBottom: '1px solid #f1f5f9',
              backgroundColor: '#ffffff'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '0.5rem'
            }}>
              <div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#1f2937',
                  fontSize: '0.875rem'
                }}>
                  📧 {message.subject}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  marginTop: '0.25rem'
                }}>
                  To: {message.memberName} ({message.memberEmail})
                </div>
              </div>
              <button
                onClick={() => handleDelete(message._id, message.memberId)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#fee2e2';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                title="Delete message"
              >
                🗑️
              </button>
            </div>
            
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#374151',
              lineHeight: '1.5',
              marginBottom: '0.5rem',
              backgroundColor: '#f9fafb',
              padding: '0.75rem',
              borderRadius: '0.375rem'
            }}>
              {message.content}
            </div>
            
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#9ca3af',
              textAlign: 'right'
            }}>
              Sent: {formatDate(message.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}