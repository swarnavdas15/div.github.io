import React from "react";

/**
 * props:
 *  - members: array
 *  - onSelect(member)
 *  - onMembersRefresh()
 */
export default function MemberList({ members = [], onSelect, onMembersRefresh }) {
  return (
    <div className="member-list">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong>Total: {members.length}</strong>
        <button className="btn small" onClick={onMembersRefresh}>Refresh</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {members.map((m) => (
          <li key={m._id} className="member-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, borderBottom: "1px solid #eee" }}>
            <img src={m.avatar || `/assets/avatars/default.png`} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{m.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{m.email}</div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn small" onClick={() => onSelect(m)}>View</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
