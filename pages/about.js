import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <div className="container">
      <Head>
        <title>About CareView - Medical Communication Training</title>
        <meta name="description" content="Learn about CareView, a simulation tool designed to help medical residents practice for the ABEM certifying exam" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <div className="logo">
          <h1>CareView</h1>
          <p className="tagline">Medical Communication Training</p>
        </div>
        <nav className="main-nav">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/about" className="nav-link active">About</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="about-container">
          <h1 className="about-title">About CareView</h1>
          
          <section className="about-section">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
              CareView is a simulation tool designed to help medical residents practice for the American Board of Emergency Medicine (ABEM) certifying exam. Our platform provides realistic patient scenarios that focus on developing effective communication skills, which are essential for emergency medicine physicians.
            </p>
          </section>
          
          <section className="about-section">
            <h2 className="section-title">ABEM Certifying Exam Preparation</h2>
            <p className="section-text">
              The ABEM certifying exam includes several case types that assess different communication competencies:
            </p>
            <ul className="feature-list">
              <li className="feature-item">
                <h3 className="feature-title">Difficult Conversations</h3>
                <p className="feature-description">
                  Practice breaking bad news to patients and families in an empathetic manner.
                </p>
              </li>
              <li className="feature-item">
                <h3 className="feature-title">Patient-Centered Communication</h3>
                <p className="feature-description">
                  Develop skills to engage effectively with patients and families using both verbal and nonverbal communication.
                </p>
              </li>
              <li className="feature-item">
                <h3 className="feature-title">Managing Conflict</h3>
                <p className="feature-description">
                  Learn to navigate differing positions and negotiate mutual understanding for patient-centered outcomes.
                </p>
              </li>
              <li className="feature-item">
                <h3 className="feature-title">Clinical Decision-Making</h3>
                <p className="feature-description">
                  Practice explaining your thought processes behind clinical decisions during patient encounters.
                </p>
              </li>
              <li className="feature-item">
                <h3 className="feature-title">Prioritization</h3>
                <p className="feature-description">
                  Develop skills to triage and prioritize care for multiple patients in the emergency department.
                </p>
              </li>
            </ul>
          </section>
          
          <section className="about-section">
            <h2 className="section-title">How CareView Helps</h2>
            <p className="section-text">
              Our platform provides realistic simulations that allow you to:
            </p>
            <ul className="benefit-list">
              <li className="benefit-item">Practice different communication techniques in a safe environment</li>
              <li className="benefit-item">Receive immediate feedback on your communication approach</li>
              <li className="benefit-item">Develop confidence in handling difficult patient interactions</li>
              <li className="benefit-item">Prepare specifically for the communication aspects of the ABEM exam</li>
              <li className="benefit-item">Improve your overall patient communication skills</li>
            </ul>
          </section>
          
          <section className="about-section">
            <h2 className="section-title">The PEARLS Method</h2>
            <p className="section-text">
              Our simulations are based on the PEARLS method of communication, which stands for:
            </p>
            <div className="pearls-container">
              <div className="pearl-item">
                <h3 className="pearl-title">Partnership</h3>
                <p className="pearl-description">Working together with the patient to address their concerns</p>
              </div>
              <div className="pearl-item">
                <h3 className="pearl-title">Empathy</h3>
                <p className="pearl-description">Recognizing and acknowledging the patient's emotions</p>
              </div>
              <div className="pearl-item">
                <h3 className="pearl-title">Apology</h3>
                <p className="pearl-description">Expressing regret for the patient's situation</p>
              </div>
              <div className="pearl-item">
                <h3 className="pearl-title">Respect</h3>
                <p className="pearl-description">Showing appreciation for the patient's efforts and strengths</p>
              </div>
              <div className="pearl-item">
                <h3 className="pearl-title">Legitimization</h3>
                <p className="pearl-description">Validating the patient's feelings and experiences</p>
              </div>
              <div className="pearl-item">
                <h3 className="pearl-title">Support</h3>
                <p className="pearl-description">Offering assistance and reassurance to the patient</p>
              </div>
            </div>
          </section>
          
          <section className="about-section">
            <h2 className="section-title">Get Started</h2>
            <p className="section-text">
              Ready to improve your communication skills? Try our simulations today and prepare for your ABEM certifying exam with confidence.
            </p>
            <div className="cta-container">
              <Link href="/" className="cta-button">
                Start Practicing
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p className="copyright">© {new Date().getFullYear()} CareView. All rights reserved.</p>
          <div className="footer-links">
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 