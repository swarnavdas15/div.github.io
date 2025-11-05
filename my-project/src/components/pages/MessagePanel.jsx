import React, { useState } from "react";

/**
 * Send notice to single member or all members
 * POST /api/admin/messages { to: "all" | memberId, subject, body }
 */
export default function MessagePanel({ onMessageSent }) {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/messages`, {
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
        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="radio" checked={toAll} onChange={()=>setToAll(true)} /> To All
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="radio" checked={!toAll} onChange={()=>setToAll(false)} /> To Specific
          </label>
        </div>

        {!toAll && (
          <input placeholder="Member ID" value={toMemberId} onChange={(e)=>setToMemberId(e.target.value)} />
        )}

        <input placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
        <textarea placeholder="Message body" value={body} onChange={(e)=>setBody(e.target.value)} rows={5} />

        <div style={{ marginTop: 8 }}>
          <button className="btn" type="submit" disabled={loading}>{loading ? "Sending..." : "Send"}</button>
        </div>
      </form>
    </div>
  );
}
