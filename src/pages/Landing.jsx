import { Check, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import Brand from '../components/Brand.jsx';

export default function Landing({ onLogin, onSignup }) {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="landing">
      <video
        className="landing-video"
        autoPlay muted loop playsInline
        poster="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2200&q=85"
      >
        <source src="https://cdn.coverr.co/videos/coverr-a-doctor-talking-to-a-patient-1572/1080p.mp4" type="video/mp4" />
      </video>
      <div className="landing-image" />
      <div className="landing-overlay" />

      <header className="landing-nav">
        <button className="brand brand-button" onClick={() => scroll('home')}><Brand /></button>
        <nav className="landing-links">
          <button onClick={() => scroll('home')}>HOME</button>
          <button onClick={() => scroll('services')}>OUR SERVICE</button>
          <button onClick={() => scroll('contact')}>CONTACT US</button>
        </nav>
        <div className="landing-auth">
          <button className="ghost-light" onClick={onLogin}>Sign In</button>
          <button className="primary" onClick={onSignup}><UserPlus size={16} /> Create Account</button>
        </div>
      </header>

      <section id="home" className="hero">
        <div className="hero-copy">
          <span className="eyebrow">SMARTER HOMECARE MANAGEMENT</span>
          <h1>Care management built around <span>people.</span></h1>
          <p>Coordinate clients, staff, documents, reports and care activity from one secure, beautifully organised portal.</p>
          <div className="hero-actions">
            <button className="primary big" onClick={onLogin}><LogIn size={18} /> Sign In</button>
            <button className="ghost-light big" onClick={onSignup}>Create an account <ChevronRight size={18} /></button>
          </div>
          <div className="trust">
            <span><Check /> Secure workflow</span>
            <span><Check /> Responsive portal</span>
            <span><Check /> Centralised records</span>
          </div>
        </div>
      </section>

      <section id="services" className="landing-section">
        <div className="landing-section-inner">
          <span className="eyebrow">OUR SERVICE</span>
          <h2>Everything your care team needs.</h2>
          <p>One connected workspace for managing people, compliance and daily care operations.</p>
          <div className="service-grid">
            {[
              ['Client Care', 'Profiles, care activities, medication and documents in one place.'],
              ['Staff Management', 'Manage staff profiles, documents, induction and compliance.'],
              ['Reports & Compliance', 'Keep reports, policies, audit history and expiry alerts organised.'],
            ].map(([title, text], i) => (
              <article key={title} className="service-card">
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <button onClick={onLogin}>Explore portal <ChevronRight size={15} /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="landing-contact">
        <div>
          <span className="eyebrow">CONTACT US</span>
          <h2>Ready to manage care with confidence?</h2>
          <p>Sign in to your existing account or create a new portal account to get started.</p>
        </div>
        <div className="contact-actions">
          <button className="primary big" onClick={onLogin}>Sign In</button>
          <button className="outline big" onClick={onSignup}>Create Account</button>
        </div>
      </section>

      <footer className="landing-footer">
        <Brand />
        <div>
          <span>© 2026 LanbethCare. All rights reserved.</span>
          <button onClick={() => scroll('home')}>Back to top ↑</button>
        </div>
      </footer>
    </div>
  );
}