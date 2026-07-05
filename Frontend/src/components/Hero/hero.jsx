import { useEffect, useRef, useState } from "react";
import "./hero.css";
import { FaFilm, FaTicketAlt, FaRegCalendarAlt } from "react-icons/fa";

function Hero() {

  const heroRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAnimate(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (

    <section ref={heroRef} className="hero" id="home">

      <div className="overlay"></div>

      <div className={animate ? "heroContent animate" : "heroContent"}>

        <div className="badge">
          FIHST FILM FESTIVAL 2026 EDITION
        </div>

        <h1 className="heroTitle">

          <span className="white">Lights.</span>

          <span className="gold"> Camera.</span>

          <br/>

          <span className="white">Experience.</span>

        </h1>

        <p className="heroDescription">
          Eight curated films. Four unforgettable nights.
          An annual celebration of storytelling,
          vision, and the shared silence of cinema hall.
        </p>

        <div className="heroButtons">
          <button className="herobookBtn">
            <FaTicketAlt />
            Book Your Seat
          </button>
        </div>

        <div className="stats">

          <div>
            <h2>6</h2>
            <span>Films</span>
          </div>

          <div>
            <h2>2</h2>
            <span>Nights</span>
          </div>

          <div>
            <h2>480</h2>
            <span>Seats</span>
          </div>

        </div>

      </div>

    </section>

  );

}

export default Hero;