import { Link } from "react-router";
import "./landing.css";

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-wrapper">
        <div className="landing-grid">
          <div className="landing-content">
            <div className="landing-heading-wrapper">
              <h1 className="landing-heading">
                Track Every Job
                <span className="landing-heading-accent">You Apply For</span>
              </h1>
              <p className="landing-subtitle">
                Add all of your job applications in one place and keep track of
                their status, rounds cleared, and more.
              </p>
            </div>

            <div className="landing-buttons">
              <Link to={"/login"}>
                <button className="landing-button-primary">Login</button>
              </Link>
              <Link to={"/signup"}>
                <button className="landing-button-secondary">Sign Up</button>
              </Link>
            </div>
          </div>

          <div className="landing-visual-container">
            <div className="landing-visual-card">
              <div className="landing-visual-content">
                <p className="landing-visual-text">
                  <img src="https://media.istockphoto.com/id/1239295086/vector/approved-and-confirmed-document-file-check-online-on-laptop-computer-or-quality-control-of.jpg?s=612x612&w=0&k=20&c=R4_135Ign1BVEdomR8m1mX9b7Gr-zavyaimewwd-rdM=" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
