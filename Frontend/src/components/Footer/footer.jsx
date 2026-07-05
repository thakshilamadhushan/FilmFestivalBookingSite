import "./footer.css";
import {FaFacebookF,FaYoutube,FaTiktok,FaMapMarkerAlt,FaEnvelope,FaPhoneAlt,FaFilm, FaFacebook,} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left */}
        <div className="footer-about">
          <div className="footer-logo">
            <div className="logo-circle">
              <FaFilm />
            </div>

            <div>
              <h2>FIHST Film Festival</h2>
              <span>2026 Edition</span>
            </div>
          </div>

          <p>
            Celebrating cinematic artistry through student passion and faculty
            curation. Eight films, four nights, one shared experience.
          </p>

          <div className="social-icons">
            <a href="https://web.facebook.com/fihstmedia/" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>

            <a href="https://www.tiktok.com/@fihstmedia" target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </a>

            <a href="https://www.youtube.com/@fihstmedia" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Center */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <a href="#home">Home</a>
            </li>

            <li>
              <a href="#movies">Movies</a>
            </li>

            <li>
              <a href="#">Download Ticke</a>
            </li>

            <li>
              <a href="/">About</a>
            </li>
          </ul>
        </div>

        {/* Right */}
        <div className="footer-contact">
          <h3>Contact</h3>

          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />

            <p>
              FIHST Media, GWUIM
            </p>
          </div>

          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <p>fihstmedia@gmail.com</p>
          </div>

          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />
            <p>+94 77 451 3740</p>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 FIHST Film Festival — Department of Technology
        </p>

        <p>Designed for cinema lovers, by cinema lovers.</p>
      </div>
    </footer>
  );
}

export default Footer;