import React, { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import "../styles/about.css";

export default function About() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetch("/notices.json")
      .then((res) => res.json())
      .then((data) => setNotices(data.notices))
      .catch((err) => console.error("Error loading notices:", err));
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Md. Uvaish",
      role: "Student Coordinator",
      img: "https://img.freepik.com/free-photo/portrait-handsome-young-man-makes-okay-gesture-demonstrates-agreement-likes-idea-smiles-happily-wears-optical-glasses-yellow-hat-t-shirt-models-indoor-its-fine-thank-you-hand-sign_273609-30676.jpg?size=626&ext=jpg",
      linkedin: "https://linkedin.com/in/uvaish",
      github: "https://github.com/uvaish",
      email: "mailto:uvaish@example.com",
    },
    {
      id: 2,
      name: "B. Jyotsana",
      role: "Vice President",
      img: "https://image.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg",
      linkedin: "https://linkedin.com/in/jyotsana",
      github: "https://github.com/jyotsana",
      email: "mailto:jyotsana@example.com",
    },
    {
      id: 3,
      name: "Swarnav Das",
      role: "Tech Head",
      img: "https://image.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg",
      linkedin: "https://linkedin.com/in/swarnav",
      github: "https://github.com/swarnav",
      email: "mailto:swarnav@example.com",
    },
    {
      id: 4,
      name: "Deepak Kumar",
      role: "Admin Head",
      img: "https://image.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg",
      linkedin: "https://linkedin.com/in/deepak",
      github: "https://github.com/deepak",
      email: "mailto:deepak@example.com",
    },
  ];

  return (
    <section id="about">
      <div className="about-section">
        <div className="about-cont">
          {/* Left Section */}
          <div className="about-left">
            <div className="text-cont">
              <h1>About Us</h1>
              <span>
                Welcome to Div Club, the premier technology club of Chouksey
                Engineering College, Bilaspur. We are a passionate community of
                tech enthusiasts, developers, and innovators dedicated to
                fostering technological excellence and creating groundbreaking
                projects that make a real impact in the digital world.
              </span>
              <button>Learn More</button>
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
    </section>
  );
}
