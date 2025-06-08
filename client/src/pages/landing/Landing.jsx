import { Link } from "react-router";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <motion.div
          className="landing-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-section">
            <h1 className="hero-title">
              Track Your Job Applications
              <span className="hero-accent">Effortlessly</span>
            </h1>
            <p className="hero-subtitle">
              Organize all your job applications in one place. Track status,
              interview rounds, and never miss an opportunity.
            </p>
          </div>

          <div className="action-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Easy Tracking</h3>
              <p className="feature-description">
                Add and organize job applications with company details, roles,
                and status updates.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Progress Monitoring</h3>
              <p className="feature-description">
                Track interview rounds, application dates, and follow-up
                reminders.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Stay Organized</h3>
              <p className="feature-description">
                Keep all your job search activities organized and never lose
                track of opportunities.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
