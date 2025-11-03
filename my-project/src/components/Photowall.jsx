import React, { useState, useEffect, useMemo } from "react";
import "../styles/photowall.css"; // keep your same CSS theme

const PhotoWall = () => {
  const [photos, setPhotos] = useState([]);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [photoPositions, setPhotoPositions] = useState({});
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    tags: '',
    imageFile: null
  });
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🧠 Simulated User (replace this with your actual auth system)
  const user = { _id: "user123", name: "Test User" };

  useEffect(() => {
    // Fetch photos (replace with API call)
    const storedPhotos = JSON.parse(localStorage.getItem('photoWallPhotos') || "[]");
    setPhotos(storedPhotos);

    // Load positions
    const savedPositions = JSON.parse(localStorage.getItem('photoWallPositions') || "{}");
    setPhotoPositions(savedPositions);
  }, []);

  // 💾 Save photos whenever updated
  useEffect(() => {
    localStorage.setItem('photoWallPhotos', JSON.stringify(photos));
  }, [photos]);

  // Combine photos with saved positions
  const positionedPhotos = useMemo(() => {
    return photos.map(photo => {
      const saved = photoPositions[photo._id] || {
        position: { x: Math.random() * 70, y: Math.random() * 70 },
        rotation: (Math.random() - 0.5) * 20,
        zIndex: Math.floor(Math.random() * 10) + 1
      };
      return { ...photo, ...saved };
    });
  }, [photos, photoPositions]);

  // 🖼 Upload handling
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadForm((prev) => ({ ...prev, imageFile: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.imageFile) {
      alert("Please fill required fields.");
      return;
    }

    const newPhoto = {
      _id: `photo_${Date.now()}`,
      title: uploadForm.title,
      description: uploadForm.description,
      imageUrl: uploadForm.imageFile,
      tags: uploadForm.tags.split(",").map(t => t.trim()),
      uploaderId: user._id,
      uploaderName: user.name,
      likes: 0,
      views: 0
    };

    setPhotos([...photos, newPhoto]);
    setUploadForm({ title: '', description: '', tags: '', imageFile: null });
    setUploadModal(false);
  };

  // ❤️ Like handler
  const handleLike = (id) => {
    setPhotos(photos.map(p => p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
  };

  // 🗑 Delete handler
  const handleDelete = (id) => {
    if (confirm("Delete this photo?")) {
      setPhotos(photos.filter(p => p._id !== id));
    }
  };

  // 🔀 Shuffle & Organize
  const shufflePhotos = () => {
    const newPositions = {};
    photos.forEach((p) => {
      newPositions[p._id] = {
        position: { x: Math.random() * 70, y: Math.random() * 70 },
        rotation: (Math.random() - 0.5) * 20,
        zIndex: Math.floor(Math.random() * 10) + 1
      };
    });
    setPhotoPositions(newPositions);
    localStorage.setItem("photoWallPositions", JSON.stringify(newPositions));
  };

  const organizePhotos = () => {
    const newPositions = {};
    const cols = 4;
    const spacing = 15;
    photos.forEach((photo, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      newPositions[photo._id] = {
        position: { x: col * (100 / cols) + spacing, y: row * 25 + 10 },
        rotation: 0,
        zIndex: 1
      };
    });
    setPhotoPositions(newPositions);
    localStorage.setItem("photoWallPositions", JSON.stringify(newPositions));
  };

  const openModal = (photo) => setModalPhoto(photo);
  const closeModal = () => setModalPhoto(null);

  return (
    <main className="photo-wall-container">
      <header className="wall-header">
        <h1 className="wall-title">Community Photo Wall</h1>
        <p className="wall-subtitle">Share your memories through beautiful photographs</p>
      </header>

      <div className="controls">
        <button className="control-btn" onClick={shufflePhotos}>🔀 Shuffle Wall</button>
        <button className="control-btn" onClick={organizePhotos}>📐 Organize</button>

        {isAdmin && (
          <>
            <button className="control-btn upload-btn" onClick={() => setUploadModal(true)}>📸 Upload Photo</button>
            <button className="control-btn" onClick={() => {
              if (confirm("Clear all photos?")) {
                setPhotos([]);
                localStorage.removeItem("photoWallPositions");
              }
            }}>🗑️ Clear Wall</button>
          </>
        )}
      </div>

      <div className="photo-wall">
        <div className="photo-count">{photos.length} photo{photos.length !== 1 ? "s" : ""}</div>
        {positionedPhotos.map(photo => (
          <div
            key={photo._id}
            className="photo-item polaroid"
            style={{
              left: `${photo.position.x}%`,
              top: `${photo.position.y}%`,
              transform: `rotate(${photo.rotation}deg)`,
              zIndex: photo.zIndex
            }}
            onClick={() => openModal(photo)}
          >
            <div className="photo-content">
              <img src={photo.imageUrl} alt={photo.title} />
            </div>
            <div className="photo-caption">{photo.title}</div>
            <div className="photo-likes" onClick={(e) => { e.stopPropagation(); handleLike(photo._id); }}>❤️ {photo.likes}</div>
            {photo.uploaderId === user._id && (
              <button className="photo-delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(photo._id); }}>🗑️</button>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalPhoto && (
        <div className="photowall-modal-overlay" onClick={(e) => e.target.classList.contains("photowall-modal-overlay") && closeModal()}>
          <div className="photowall-modal-container">
            <div className="photowall-modal-header">
              <img src={modalPhoto.imageUrl} alt={modalPhoto.title} className="photowall-modal-image" />
              <div className="photowall-modal-content-section">
                <button className="photowall-modal-close" onClick={closeModal}>✕</button>
                <h2 className="photowall-modal-title">{modalPhoto.title}</h2>
                <p className="photowall-modal-photographer">By {modalPhoto.uploaderName}</p>
                {modalPhoto.description && <p className="photowall-modal-description">{modalPhoto.description}</p>}
                <div className="photowall-modal-stats">
                  <button className="photowall-like-button" onClick={() => handleLike(modalPhoto._id)}>❤️ {modalPhoto.likes}</button>
                </div>
                {modalPhoto.tags && modalPhoto.tags.length > 0 && (
                  <div className="photowall-modal-tags">
                    {modalPhoto.tags.map((tag, i) => <span key={i} className="photowall-tag">#{tag}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="upload-modal-overlay" onClick={(e) => e.target.classList.contains("upload-modal-overlay") && setUploadModal(false)}>
          <div className="upload-modal-content">
            <div className="upload-modal-header">
              <h2>Upload New Photo</h2>
              <button className="upload-close-btn" onClick={() => setUploadModal(false)}>✕</button>
            </div>
            <div className="upload-form-container">
              <label>Photo Title *</label>
              <input type="text" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} />

              <label>Description</label>
              <textarea value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}></textarea>

              <label>Tags (comma separated)</label>
              <input type="text" value={uploadForm.tags} onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })} />

              <label>Choose Photo *</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
              {uploadForm.imageFile && <img src={uploadForm.imageFile} alt="Preview" style={{ width: "100%", marginTop: "10px", borderRadius: "8px" }} />}

              <div className="upload-actions">
                <button onClick={() => setUploadModal(false)}>Cancel</button>
                <button onClick={handleUpload} disabled={!uploadForm.title || !uploadForm.imageFile}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PhotoWall;
