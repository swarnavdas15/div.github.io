import React, { useState, useEffect } from "react";
import "../../styles/admindasboard.css";

/**
 * Send notice to single member or all members
 * POST /api/admin/messages { to: "all" | memberId, subject, body }
 */
export default function MessagePanel({ onMessageSent, members }) {
  const [toAll, setToAll] = useState(true);
  const [toMemberId, setToMemberId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !body) return alert("Subject and message required");
    setLoading(true);
    try {
      const payload = { to: toAll ? "all" : toMemberId, subject, body };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      alert("Message sent");
      setSubject(""); setBody("");
      onMessageSent?.();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error sending");
    } finally { setLoading(false); }
  };

  return (
    <div className="message-panel">
      <h3>Send Notice</h3>
      <form onSubmit={handleSend}>
        <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              checked={toAll}
              onChange={()=>{
                setToAll(true);
                setToMemberId("");
              }}
            />
            To All Members
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              checked={!toAll}
              onChange={()=>setToAll(false)}
            />
            To Specific Member
          </label>
        </div>

        {!toAll && (
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Select Member
            </label>
            <select
              value={toMemberId}
              onChange={(e)=>setToMemberId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem"
              }}
              required
            >
              <option value="">Choose a member...</option>
              {members && members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Subject
          </label>
          <input
            placeholder="Message subject"
            value={subject}
            onChange={(e)=>setSubject(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem"
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Message
          </label>
          <textarea
            placeholder="Write your message here..."
            value={body}
            onChange={(e)=>setBody(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              resize: "vertical"
            }}
            required
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button
            className="btn"
            type="submit"
            disabled={loading || (!toAll && !toMemberId)}
            style={{
              backgroundColor: loading || (!toAll && !toMemberId) ? "#9ca3af" : "#667eea",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: loading || (!toAll && !toMemberId) ? "not-allowed" : "pointer",
              fontSize: "0.875rem"
            }}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
