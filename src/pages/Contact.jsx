import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <main className="contact-view">
      <h2>Profile & Contact</h2>

      <div className="profile-section">
        <h3>Ye-hwan Lee</h3>
        <p className="subtitle">Aerospace & Mechanical Engineering</p>

        <div className="contact-card">
          <div className="contact-item">
            <span className="label">Research Interest</span>
            <span className="value">
              Fluid Dynamics (Drop Impact, Worthington Jets), Pure Mathematics
              (Number Theory)
            </span>
          </div>
          <div className="contact-item">
            <span className="label">Tech Stack</span>
            <span className="value">
              CATIA, SolidWorks, ImageJ, CFD, AutoHotkey
            </span>
          </div>
          <div className="contact-item">
            <span className="label">Email</span>
            <span className="value">your.email@example.com</span>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>Ye-hwan Lee</h3>
        <p className="subtitle">Aerospace & Mechanical Engineering</p>

        <div className="contact-card">
          <div className="contact-item">
            <span className="label">Research Interest</span>
            <span className="value">
              Fluid Dynamics (Drop Impact, Worthington Jets), Pure Mathematics
              (Number Theory)
            </span>
          </div>
          <div className="contact-item">
            <span className="label">Tech Stack</span>
            <span className="value">
              CATIA, SolidWorks, ImageJ, CFD, AutoHotkey
            </span>
          </div>
          <div className="contact-item">
            <span className="label">Email</span>
            <span className="value">your.email@example.com</span>
          </div>
        </div>
      </div>
    </main>
  );
}
