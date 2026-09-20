import "./footer.css";
import {
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFilm,
  FaFacebook,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToSection = (id) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
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
            <a
              href="https://web.facebook.com/fihstmedia/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>

            <a
              href="https://www.tiktok.com/@fihstmedia"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok />
            </a>

            <a
              href="https://www.youtube.com/@fihstmedia"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Center */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <button onClick={() => scrollToSection("home")}>Home</button>
            </li>

            <li>
              <button onClick={() => scrollToSection("movies")}>Movies</button>
            </li>

            <li>
              <Link to="/retrieveticket" className="retrieveTicketLink">
                Download Ticket
              </Link>
            </li>
          </ul>
        </div>

        {/* Right */}
        <div className="footer-contact">
          <h3>Contact</h3>

          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />

            <p>FIHST Media, GWUIM</p>
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
        <p>© 2026 FIHST Film Festival — Department of Technology</p>

        <p>Designed for cinema lovers, by cinema lovers.</p>
      </div>
    </footer>
  );
}

export default Footer;
