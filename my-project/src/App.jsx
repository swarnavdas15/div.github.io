import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Events from './components/Events'
import PhotoWall from './components/Photowall'
import Projects from './components/Projects'
import Contacts from './components/Contacts'
import Footer from './components/Footer'
import Login from "./components/Login"
import Registration from "./components/Registration"
import AdminDashboard from './components/pages/adminDashboard'
import MemberDashboard from './components/pages/MemberDashboard'
import EventModal from './components/pages/EventModal'
import Engineering from './components/pages/Engineering'

function App() {

  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const [showMemberDashboard, setShowMemberDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(null);

  // Get user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const openMemberDashboard = () => setShowMemberDashboard(true);
  const closeMemberDashboard = () => setShowMemberDashboard(false);
  const openAdminDashboard = () => setShowAdminDashboard(true);
  const closeAdminDashboard = () => setShowAdminDashboard(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    
    // Open appropriate dashboard based on user role
    if (userData.role === 'admin') {
      setShowAdminDashboard(true);
    } else {
      setShowMemberDashboard(true);
    }
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowRegistration(false);
  };

  const closeLogin = () => setShowLogin(false);

  const openRegistration = () => {
    setShowRegistration(true);
    setShowLogin(false);
  };

  const closeRegistration = () => setShowRegistration(false);

  const openEventModal = (event) => setSelectedEvent(event);
  const closeEventModal = () => setSelectedEvent(null);

  useEffect(() => {
  console.log("✅ API URL:", import.meta.env.VITE_API_URL);
}, []);

  return (
    <>
      <Navbar
        openLogin={openLogin}
        openRegistration={openRegistration}
        openMemberDashboard={openMemberDashboard}
        openAdminDashboard={openAdminDashboard}
        user={user}
        onLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setShowMemberDashboard(false);
          setShowAdminDashboard(false);
        }}
      />
      <Routes>
        {/* 🏠 Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <Events
                openEventModal={openEventModal}
                isAdmin={user?.role === 'admin'}
                userId={user?._id}
              />
              <PhotoWall />
              <Projects currentUser={user} />
              <Contacts />
            </>
          }
        />

        {/* 👤 Member Dashboard */}
        <Route path="/dashboard" element={<MemberDashboard />} />

        {/* 🛠 Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* 🔧 Engineering Resources */}
        <Route path="/engineering" element={<Engineering openLogin={openLogin} openRegistration={openRegistration} />} />

        {/* Optional login/register pages */}
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
      <Footer/>

       {showLogin && (
        <div className="modal-overlay">
          <Login
            closeModal={closeLogin}
            openRegistration={openRegistration}
            isModal={true}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}

      {showRegistration && (
        <div className="modal-overlay">
          <Registration closeModal={closeRegistration} openLogin={openLogin} isModal={true} />
        </div>
      )}

      {showMemberDashboard && (
        <MemberDashboard onClose={closeMemberDashboard} />
      )}

      {showAdminDashboard && (
        <AdminDashboard onClose={closeAdminDashboard} />
      )}

      {selectedEvent && (
        <div className="modal-overlay">
          <EventModal
            event={selectedEvent}
            onClose={closeEventModal}
          />
        </div>
      )}

    </>
  )
}

export default App
