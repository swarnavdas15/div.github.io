import React, { useState, useEffect, useMemo } from "react";
import Loading from "./Loading";
import Error from "./Error";
import "../styles/photowall.css"; // keep your same CSS theme

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user from localStorage (same format as your existing auth system)
  const getUser = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        return parsedUser;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return null;
  };

  // API functions
  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching photos from:', `${API_BASE}/api/photos`);
      const response = await fetch(`${API_BASE}/photos`);
      const data = await response.json();
      console.log('📸 Photos fetch response:', data);
      if (data.success) {
        setPhotos(data.data);
        setLoading(false);
      } else {
        throw new Error(data.message || 'Failed to fetch photos');
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError(error.message);
      setLoading(false);
    }
  };
  
  const handleRetry = () => {
    fetchPhotos();
  };

  const uploadPhoto = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('🔐 Upload attempt - Token exists:', !!token);
      console.log('👤 Upload attempt - User data:', userData);
      
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }

      const requestOptions = {
        method: 'POST',
        body: formData
      };

      // Only add Authorization header if token exists
      requestOptions.headers = {
        'Authorization': `Bearer ${token}`
      };

      console.log('📤 Sending upload request to:', `${API_BASE}/photos/upload`);
      
      const response = await fetch(`${API_BASE}/api/photos/upload`, requestOptions);
      
      console.log('📥 Upload response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Upload successful:', data);
      return data;
    } catch (error) {
      console.error('💥 Upload error:', error);
      throw error;
    }
  };

  const toggleLike = async (photoId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to like photos.');
        return;
      }

      console.log('❤️ Toggling like for photo:', photoId);
      
      const response = await fetch(`${API_BASE}/api/photos/${photoId}/toggle-like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update photos state with new like data
        setPhotos(photos.map(p => {
          if (p._id === photoId) {
            return {
              ...p,
              likes: data.data.likes,
              likedBy: data.data.likedBy,
              isLiked: data.data.isLiked
            };
          }
          return p;
        }));
        
        // Also update localStorage with new like data
        const updatedPhotos = photos.map(p => {
          if (p._id === photoId) {
            return {
              ...p,
              likes: data.data.likes,
              likedBy: data.data.likedBy,
              isLiked: data.data.isLiked
            };
          }
          return p;
        });
        localStorage.setItem('photoWallPhotos', JSON.stringify(updatedPhotos));
        
        console.log('❤️ Like updated successfully:', data.data);
      } else {
        console.error('Like toggle failed:', data.message);
        alert(data.message || 'Failed to update like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Error updating like. Please try again.');
    }
  };

  const clearAllPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/photos`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPhotos([]);
        localStorage.removeItem('photoWallPositions');
        localStorage.removeItem('photoWallPhotos');
        console.log('🗑️ Cleared all photos from API and localStorage');
      }
    } catch (error) {
      console.error('Error clearing photos:', error);
      alert('Error clearing photos');
    }
  };

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    
    // Load saved photos from localStorage as immediate fallback
    const savedPhotos = JSON.parse(localStorage.getItem('photoWallPhotos') || '[]');
    console.log('💾 Loaded from localStorage:', savedPhotos.length, 'photos');
    if (savedPhotos.length > 0) {
      setPhotos(savedPhotos);
    }
    
    // Load positions from localStorage (preserve existing functionality)
    const savedPositions = JSON.parse(localStorage.getItem('photoWallPositions') || "{}");
    console.log('📍 Loaded positions:', Object.keys(savedPositions).length);
    setPhotoPositions(savedPositions);
    
    // Fetch photos from API (will override local data if successful)
    fetchPhotos();
  }, []);

  // Save photos to localStorage (preserve existing functionality)
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('photoWallPhotos', JSON.stringify(photos));
    }
  }, [photos]);

  // Combine photos with saved positions
 const positionedPhotos = useMemo(() => {
  console.log('🔗 Combining', photos.length, 'photos with positions');
  return photos
    .filter(photo => photo && photo._id) // remove null/invalid photos
    .map(photo => {
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
    setUploadForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleUpload = async () => {
    console.log('🚀 Starting upload process...');
    console.log('📝 Form data:', uploadForm);
    console.log('👤 User data:', user);

    // Validation
    if (!uploadForm.title.trim()) {
      alert("Please enter a photo title.");
      return;
    }

    if (!uploadForm.imageFile) {
      alert("Please select an image file.");
      return;
    }

    if (!user) {
      alert("You must be logged in to upload photos.");
      return;
    }

    if (user.role !== 'admin') {
      alert("Only administrators can upload photos.");
      return;
    }

    setUploading(true);
    
    try {
      console.log('📋 Creating FormData...');
      const formData = new FormData();
      formData.append('image', uploadForm.imageFile);
      formData.append('title', uploadForm.title.trim());
      formData.append('description', uploadForm.description.trim());
      formData.append('tags', uploadForm.tags.trim());
      formData.append('uploaderName', user.name);

      console.log('📤 FormData created, calling uploadPhoto...');
      const result = await uploadPhoto(formData);
      
      console.log('📥 Upload result:', result);
      
      if (result.success) {
        console.log('✅ Upload successful, updating photos list...');
        setPhotos(prevPhotos => {
          const newPhotos = [...prevPhotos, result.data];
          localStorage.setItem('photoWallPhotos', JSON.stringify(newPhotos));
          console.log('💾 Updated localStorage with new photo');
          return newPhotos;
        });
        setUploadForm({ title: '', description: '', tags: '', imageFile: null });
        setUploadModal(false);
        alert('Photo uploaded successfully!');
      } else {
        console.error('❌ Upload failed:', result.message);
        alert(`Error uploading photo: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('💥 Upload error details:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Error uploading photo: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // Helper function to check if current user has liked a photo
  const isPhotoLikedByUser = (photo) => {
    if (!user || !user._id || !photo?.likedBy) return false;
    return photo.likedBy.includes(user._id);
  };

  // ❤️ Like handler with user authentication check
  const handleLike = (id) => {
    if (!user) {
      alert('Please log in to like photos.');
      return;
    }
    toggleLike(id);
  };

  // 🗑 Delete handler (keep existing local functionality for users to delete their own photos)
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
        {localStorage.getItem('photoWallPhotos') && photos.length > 0 && !loading && (
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
            📱 Showing cached photos - Use refresh button for latest updates
          </p>
        )}
      </header>

      <div className="controls">
        <button className="control-btn" onClick={shufflePhotos}>🔀 Shuffle Wall</button>
        <button className="control-btn" onClick={organizePhotos}>📐 Organize</button>
        <button className="control-btn" onClick={() => { setLoading(true); fetchPhotos(); }}>🔄 Refresh</button>

        {user?.role === 'admin' && (
          <>
            <button className="control-btn upload-btn" onClick={() => setUploadModal(true)}>📸 Upload Photo</button>
            <button className="control-btn" onClick={() => {
              if (confirm("Clear all photos?")) {
                clearAllPhotos();
              }
            }}>🗑️ Clear Wall</button>
          </>
        )}
      </div>

      <div className="photo-wall">
        <div className="photo-count">{photos.length} photo{photos.length !== 1 ? "s" : ""}</div>
        {(positionedPhotos || []).filter(photo => photo && photo._id).map((photo, index) => {
          // Assign size classes cyclically
          const sizeClass = index % 3 === 0 ? 'size-small' : index % 3 === 1 ? 'size-medium' : 'size-large';
          return (
            <div
              key={photo._id}
              className={`photo-item polaroid ${sizeClass}`}
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
              <div className={`photo-likes ${isPhotoLikedByUser(photo) ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); handleLike(photo._id); }}>
                {isPhotoLikedByUser(photo) ? '💖' : '❤️'} {photo.likes}
              </div>
              {user?._id && photo.uploaderId === user._id && (
                <button className="photo-delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(photo._id); }}>🗑️</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalPhoto && (
        <div className="photowall-ph-modal-overlay" onClick={(e) => e.target.classList.contains("photowall-ph-modal-overlay") && closeModal()}>
          <div className="photowall-ph-modal-container">
            <div className="photowall-ph-modal-header">
              <img src={modalPhoto.imageUrl} alt={modalPhoto.title} className="photowall-ph-modal-image" />
              <div className="photowall-ph-modal-content-section">
                <button className="photowall-ph-modal-close" onClick={closeModal}>✕</button>
                <h2 className="photowall-ph-modal-title">{modalPhoto.title}</h2>
                <p className="photowall-ph-modal-photographer">By {modalPhoto.uploaderName}</p>
                {modalPhoto.description && <p className="photowall-ph-modal-description">{modalPhoto.description}</p>}
                <div className="photowall-ph-modal-stats">
                  <button
                    className={`photowall-like-button ${isPhotoLikedByUser(modalPhoto) ? 'liked' : ''}`}
                    onClick={() => handleLike(modalPhoto._id)}
                  >
                    {isPhotoLikedByUser(modalPhoto) ? '💖' : '❤️'} {modalPhoto.likes}
                  </button>
                </div>
                {modalPhoto.tags && modalPhoto.tags.length > 0 && (
                  <div className="photowall-ph-modal-tags">
                    {modalPhoto.tags.map((tag, i) => <span key={i} className="photowall-tag">#{tag}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && user?.role === 'admin' && (
        <div className="upload-ph-modal-overlay" onClick={(e) => e.target.classList.contains("upload-ph-modal-overlay") && setUploadModal(false)}>
          <div className="upload-ph-modal-content">
            <div className="upload-ph-modal-header">
              <div className="upload-header-icon">📸</div>
              <h2 className="upload-ph-modal-title">Upload New Photo</h2>
              <button className="upload-close-btn" onClick={() => setUploadModal(false)}>✕</button>
            </div>
            <div className="upload-form-container">
              
              {/* Photo Title Section */}
              <div className="upload-section">
                <label className="upload-label">Photo Title *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="upload-input"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="Enter a descriptive title for your photo"
                  />
                  <span className="input-icon">📝</span>
                </div>
                <div className="input-help">Choose a clear, descriptive title for your photo</div>
              </div>

              {/* Description Section */}
              <div className="upload-section">
                <label className="upload-label">Description</label>
                <div className="input-wrapper">
                  <textarea
                    className="upload-textarea"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    placeholder="Add a description to share the story behind your photo..."
                  />
                  <span className="input-icon textarea-icon">💭</span>
                </div>
                <div className="input-help">Tell us more about this photo (optional)</div>
              </div>

              {/* Tags Section */}
              <div className="upload-section">
                <label className="upload-label">Tags</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="upload-input"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    placeholder="nature, sunset, friends (comma separated)"
                  />
                  <span className="input-icon">🏷️</span>
                </div>
                <div className="input-help">Add tags to help categorize your photo (comma separated)</div>
              </div>

              {/* File Upload Section */}
              <div className="upload-section">
                <label className="upload-label">Choose Photo *</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="file-input-hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    {!uploadForm.imageFile ? (
                      <>
                        <div className="upload-icon">☁️</div>
                        <div className="upload-text">
                          <strong>Click to upload or drag and drop</strong>
                          <span>PNG, JPG, GIF up to 10MB</span>
                        </div>
                        <div className="upload-requirements">Maximum file size: 10MB</div>
                      </>
                    ) : (
                      <div className="image-preview-modern">
                        <img
                          src={URL.createObjectURL(uploadForm.imageFile)}
                          alt="Preview"
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadForm({ ...uploadForm, imageFile: null });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="upload-actions">
                <button
                  className="upload-cancel-btn"
                  onClick={() => setUploadModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  className="upload-submit-btn-modern"
                  onClick={handleUpload}
                  disabled={!uploadForm.title || !uploadForm.imageFile || uploading}
                >
                  {uploading ? (
                    <>
                      <div className="upload-spinner"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      📤 Upload Photo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <Loading
          type="spinner"
          message="Loading beautiful memories..."
          interactive={true}
          showProgress={true}
          size="medium"
          suggestions={[
            "We're curating your photo experience",
            "Preparing the visual feast for you",
            "Loading community moments..."
          ]}
        />
      ) : error ? (
        <Error
          type="error"
          title="Failed to Load Photos"
          message={error}
          onRetry={handleRetry}
          showRetry={true}
          showGoHome={false}
          suggestions={[
            "Check your internet connection",
            "Try refreshing the page",
            "The photos might be temporarily unavailable"
          ]}
        />
      ) : (
        null
      )}
    </main>
  );
};

export default PhotoWall;
