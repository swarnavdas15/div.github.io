import React, { useState } from "react";

/**
 * Upload file to backend (admin)
 * POST /api/admin/resources (form-data: file, title, description)
 */
export default function ResourceUploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const upload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("File and title required");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("description", desc);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/resources`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      alert("Resource uploaded");
      setFile(null); setTitle(""); setDesc("");
      onUploaded?.();
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload error");
    } finally { setLoading(false); }
  };

  return (
    <div className="resource-uploader">
      <h3>Upload Resource</h3>
      <form onSubmit={upload}>
        <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} />
        <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
        <button className="btn" type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload"}</button>
      </form>
    </div>
  );
}
