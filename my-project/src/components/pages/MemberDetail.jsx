import React, { useState } from "react";
import "../../styles/admindasboard.css";

/**
 * props:
 *  - member (object)
 *  - onUpdated(updatedMember)
 *  - onDeleted(memberId)
 */
export default function MemberDetail({ member, onUpdated, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [pwd, setPwd] = useState("");
  const token = localStorage.getItem("token");

  const toggleDeactivate = async () => {
    if (!confirm(`Toggle active status for ${member.name}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/members/${member._id}/deactivate`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Action failed");
      onUpdated(data.user || data);
      alert("Status updated");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${member.name}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/members/${member._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({message:'Delete failed'}));
        throw new Error(body.message || "Delete failed");
      }
      onDeleted(member._id);
      alert("Member deleted");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally { setLoading(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!pwd || pwd.length < 6) {
      alert("Password should be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/members/${member._id}/password`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      alert("Password changed");
      setPwd("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally { setLoading(false); }
  };

  return (
    <div className="member-detail">
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <img src={member.avatar || '/assets/avatars/default.png'} alt="" style={{ width: 88, height: 88, borderRadius: 12, objectFit: "cover" }} />
        <div>
          <h3 style={{ margin: 0 }}>{member.name}</h3>
          <div className="muted">{member.email}</div>
          <div className="muted">College: {member.collegeName || '-'}</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={toggleDeactivate} disabled={loading}>
          {member.isActive === false ? "Activate" : "Deactivate"}
        </button>
        <button className="btn danger" onClick={handleDelete} disabled={loading} style={{ marginLeft: 8 }}>
          Delete
        </button>
      </div>

      <form onSubmit={changePassword} style={{ marginTop: 16 }}>
        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Change Password (admin)</div>
          <input value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="New password" type="password" />
        </label>
        <div style={{ marginTop: 8 }}>
          <button className="btn small" type="submit" disabled={loading}>Change Password</button>
        </div>
      </form>

      <section style={{ marginTop: 18 }}>
        <h4>Other details</h4>
        <pre style={{ background: "#fafafa", padding: 8, borderRadius: 6, fontSize: 13 }}>
          {JSON.stringify(member, null, 2)}
        </pre>
      </section>
    </div>
  );
}
