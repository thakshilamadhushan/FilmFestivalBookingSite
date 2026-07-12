import "./navbar.css";
import { FaTicketAlt, FaFilm, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

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
        <li><a href="/#home">Home</a></li>
        <li><a href="/#movies">Movies</a></li>
        <li><a href="/retrieveticket">Download Ticket</a></li>
      </ul>

      <div
        className="menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

    </nav>
  );
}

export default Navbar;