import "./bookingMovieCard.css";
import { FaStar } from "react-icons/fa";

export default function MovieCard() {
  return (
    <div className="movie-card card">

      <div className="movie-image">
        <img
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700"
          alt="Movie"
        />
      </div>

      <div className="movie-content">


        <h1>Veil of Silence</h1>

        <p className="genre">
          Drama / Mystery · 2h 08m
        </p>

        <p className="description">
          A grieving journalist returns to her ancestral village after a
          decade, only to unravel a buried truth about her mother's
          disappearance. A slow-burning meditation on memory, guilt and the
          courage to face what we'd rather forget.
        </p>

        <div className="movie-info">

          <div>
            <small>DIRECTOR</small>
            <h4>Kavya Suresh</h4>
          </div>

          <div>
            <small>DURATION</small>
            <h4>2h 08m</h4>
          </div>

          <div>
            <small>HALL</small>
            <h4>Students' Center</h4>
          </div>

          <div>
            <small>LANGUAGE</small>
            <h4>Tamil / English</h4>
          </div>

        </div>

        <div className="movierating">

          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />

          <span>4.8</span>

          <small>(412)</small>

        </div>

      </div>

    </div>
  );
}