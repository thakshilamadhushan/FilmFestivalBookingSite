import "./navbar.css";
import { FaFilm, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="navbar">
      <div className="logo">
        <div className="logoIcon">
          <FaFilm />
        </div>

        <div>
          <h2>FIHST Film Festival</h2>
          <span>2026 EDITION</span>
        </div>
      </div>

      <ul className={menuOpen ? "navLinks active" : "navLinks"}>
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

      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
}

export default Navbar;
