import React, { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaTimes } from "react-icons/fa";
import "../styles/about.css";

export default function About() {
  const [notices, setNotices] = useState([]);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    fetch("/notices.json")
      .then((res) => res.json())
      .then((data) => setNotices(data.notices))
      .catch((err) => console.error("Error loading notices:", err));
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Nilesh Gupta",
      role: "Faculty Coordinator",
      img: "https://img.freepik.com/free-photo/portrait-handsome-young-man-makes-okay-gesture-demonstrates-agreement-likes-idea-smiles-happily-wears-optical-glasses-yellow-hat-t-shirt-models-indoor-its-fine-thank-you-hand-sign_273609-30676.jpg?size=626&ext=jpg",
      linkedin: "https://linkedin.com/in/uvaish",
      github: "https://github.com/uvaish",
      email: "mailto:uvaish@example.com",
    },
    {
      id: 2,
      name: "Dr. Shanu Kuttan",
      role: "HOD CSE",
      img: "https://img.freepik.com/free-photo/portrait-handsome-young-man-makes-okay-gesture-demonstrates-agreement-likes-idea-smiles-happily-wears-optical-glasses-yellow-hat-t-shirt-models-indoor-its-fine-thank-you-hand-sign_273609-30676.jpg?size=626&ext=jpg",
      linkedin: "https://linkedin.com/in/uvaish",
      github: "https://github.com/uvaish",
      email: "mailto:uvaish@example.com",
    },
    {
      id: 3,
      name: "Chandrabhan Mahato",
      role: "President",
      img: "https://raw.githubusercontent.com/swarnavdas15/div-document/refs/heads/main/WhatsApp%20Image%202025-11-06%20at%2023.20.50_c7c8180e.jpg",
      linkedin: "https://linkedin.com/in/uvaish",
      github: "https://github.com/uvaish",
      email: "mailto:uvaish@example.com",
    },
    {
      id: 4,
      name: "B. Jyotsana",
      role: "Vice President",
      img: "https://raw.githubusercontent.com/swarnavdas15/div-document/refs/heads/main/WhatsApp%20Image%202025-11-07%20at%2010.08.25_4fda5f8b.jpg",
      linkedin: "https://linkedin.com/in/jyotsana",
      github: "https://github.com/jyotsana",
      email: "mailto:jyotsana@example.com",
    },
    {
      id: 5,
      name: "Swarnav Das",
      role: "Tech Head",
      img: "https://raw.githubusercontent.com/swarnavdas15/div-document/refs/heads/main/WhatsApp%20Image%202025-11-03%20at%2019.21.52_c5733fd4.jpg",
      linkedin: "https://www.linkedin.com/in/swarnav-das-6929542bb",
      github: "https://github.com/swarnavdas15",
      email: "mailto:swarnavofcl15@gmail.com",
    },
    {
      id: 6,
      name: "Deepak Kumar",
      role: "Admin Head",
      img: "https://raw.githubusercontent.com/swarnavdas15/div-document/refs/heads/main/WhatsApp%20Image%202025-11-07%20at%2010.54.53_09d8ed93.jpg",
      linkedin: "https://linkedin.com/in/deepak",
      github: "https://github.com/deepak",
      email: "mailto:deepak@example.com",
    },
    {
      id: 7,
      name: "Md. Uvaish",
      role: "Student Coordinator",
      img: "https://raw.githubusercontent.com/swarnavdas15/div-document/refs/heads/main/WhatsApp%20Image%202025-11-06%20at%2023.46.53_8495a968.jpg",
      linkedin: "https://linkedin.com/in/uvaish",
      github: "https://github.com/uvaish",
      email: "mailto:uvaish@example.com",
    },
    
  ];

  const openAboutModal = () => {
    setShowAboutModal(true);
  };

  const closeAboutModalAndScrollToContact = () => {
    setShowAboutModal(false);
    // Smooth scroll to contact section
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300); // Small delay to allow modal to close first
  };

  const closeAboutModal = () => {
    setShowAboutModal(false);
  };

  return (
    <section id="about">
      <div className="about-section">
        <div className="about-cont">
          {/* Left Section */}
          <div className="about-left">
            <div className="text-cont">
              <h1>About Us</h1>
              <span>
                <br />
      
               DIV—short for Dive Into Vision—is a vibrant student-led community at Chouksey Engineering College that empowers learners to explore, innovate, and grow in the world of technology. Founded in 2024, the club serves as a dynamic platform where aspiring engineers and tech enthusiasts collaborate on real-world projects, share knowledge, and build future-ready skills. With the motto “We make every bit worthy,” DIV encourages students to push boundaries and turn their ideas into impactful solutions.
              </span>
              <button onClick={openAboutModal}>Learn More</button>
            </div>
          </div>

          {/* Right Section */}
          <div className="about-right">
            <div className="member-list">
              <div className="mem-gallery">
                <div className="template">
                  <span>WE ARE ...</span>
                </div>
                <div className="container">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flip-box">
                      <div className="flip-inner">
                        {/* Front Side */}
                        <div className="flip-front">
                          <div className="imgBox">
                            <img src={member.img} alt={member.name} />
                          </div>
                          <div className="content">
                            <h2>
                              {member.name} <br />
                              <span>{member.role}</span>
                            </h2>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="flip-back">
                          <h3>Connect with me</h3>
                          <div className="social-icons">
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FaLinkedin />
                            </a>
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FaGithub />
                            </a>
                            <a href={member.email}>
                              <FaEnvelope />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🧩 Dynamic Notice Board */}
              <div className="member-info">
                <h2 className="notice-title">📢 Notice Board</h2>
                {notices.length > 0 ? (
                  <ul className="notice-list">
                    {notices.map((notice, index) => (
                      <li key={index} className="notice-item">
                        {notice}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Loading notices...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="about-modal-overlay" onClick={closeAboutModal}>
          <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="about-modal-header">
              <h2>About Div Club</h2>
              <button className="modal-close-btn" onClick={closeAboutModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="about-modal-body">
              {/* About Us Section */}
              <div className="about-section-content">
                <div className="about-icon">🏢</div>
                <h3>About Us</h3>
                <p>
                  Div Club is the premier technology club of Chouksey Engineering College, Bilaspur,
                  established with a vision to create a thriving ecosystem of innovation, learning,
                  and technological advancement. We are a passionate community of students,
                  tech enthusiasts, developers, and innovators who come together to explore the
                  latest technologies and build groundbreaking projects.
                </p>
                <p>
                  Since our inception, we have been at the forefront of promoting technological
                  excellence and fostering creativity among engineering students. Our club serves
                  as a platform for students to collaborate, learn from each other, and develop
                  real-world solutions that make a positive impact in the digital world.
                </p>
              </div>

              {/* Mission Section */}
              <div className="mission-section-content">
                <div className="mission-icon">🎯</div>
                <h3>Our Mission</h3>
                <p>
                  Our mission is to bridge the gap between academic learning and practical
                  application by providing students with opportunities to work on real-world
                  projects, participate in hackathons, and engage with industry professionals.
                </p>
                <ul className="mission-list">
                  <li>Foster innovation and creativity among students</li>
                  <li>Provide hands-on experience with cutting-edge technologies</li>
                  <li>Build a strong community of like-minded individuals</li>
                  <li>Develop problem-solving skills through practical projects</li>
                  <li>Prepare students for successful careers in technology</li>
                  <li>Encourage entrepreneurship and startup culture</li>
                </ul>
              </div>

              {/* Goals Section */}
              <div className="goals-section-content">
                <div className="goals-icon">🚀</div>
                <h3>Our Goals</h3>
                <div className="goals-grid">
                  <div className="goal-item">
                    <div className="goal-number">01</div>
                    <h4>Skill Development</h4>
                    <p>Conduct regular workshops, seminars, and training sessions to enhance technical skills</p>
                  </div>
                  <div className="goal-item">
                    <div className="goal-number">02</div>
                    <h4>Project Development</h4>
                    <p>Encourage and support members in developing innovative projects and applications</p>
                  </div>
                  <div className="goal-item">
                    <div className="goal-number">03</div>
                    <h4>Industry Collaboration</h4>
                    <p>Build partnerships with industry leaders for mentorship and placement opportunities</p>
                  </div>
                  <div className="goal-item">
                    <div className="goal-number">04</div>
                    <h4>Community Impact</h4>
                    <p>Create solutions that address real-world problems and benefit society</p>
                  </div>
                  <div className="goal-item">
                    <div className="goal-number">05</div>
                    <h4>Research & Development</h4>
                    <p>Promote research activities and encourage publication of technical papers</p>
                  </div>
                  <div className="goal-item">
                    <div className="goal-number">06</div>
                    <h4>Global Recognition</h4>
                    <p>Represent our college and club in national and international technology competitions</p>
                  </div>
                </div>
              </div>

              {/* Key Activities Section */}
              <div className="activities-section-content">
                <div className="activities-icon">⚡</div>
                <h3>What We Do</h3>
                <div className="activities-grid">
                  <div className="activity-item">
                    <span className="activity-icon">💻</span>
                    <span>Web Development</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">📱</span>
                    <span>Mobile App Development</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">🤖</span>
                    <span>AI & Machine Learning</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">🔒</span>
                    <span>Cybersecurity</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">☁️</span>
                    <span>Cloud Computing</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">🎮</span>
                    <span>Game Development</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">🔗</span>
                    <span>Blockchain Technology</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">📊</span>
                    <span>Data Science</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-modal-footer">
              <button className="contact-btn" onClick={closeAboutModalAndScrollToContact}>
                Get in Touch
              </button>
              <p className="join-text">Ready to join our innovative community?</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
