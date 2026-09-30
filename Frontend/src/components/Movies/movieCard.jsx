import "./movieCard.css";
import { FaStar, FaClock, FaCalendar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="movieCard">
      <div
        className="moviecard-poster"
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        <div className="top">
          <span className="rating">
            <FaStar />

            {movie.imdb}
          </span>
        </div>
      </div>

      <div className="info">
        <h2>{movie.title}</h2>

        <h5>{movie.genre}</h5>

        <div className="details">
          <p>
            <FaClock />
            {movie.duration}
          </p>

          <p>{movie.language}</p>
        </div>

        {movie.shows && movie.shows.length > 0 ? (
          <div className="show-schedule">
            {Object.entries(
              movie.shows.reduce((groups, show) => {
                if (!groups[show.date]) {
                  groups[show.date] = [];
                }

                groups[show.date].push(show);

                return groups;
              }, {}),
            ).map(([date, shows]) => (
              <div className="show-day" key={date}>
                <div className="dates">
                  <span>
                    <FaCalendar />
                    {date}
                  </span>
                </div>

                <div className="times">
                  {shows.map((show) => (
                    <span key={show._id}>
                      <FaClock />
                      {show.time}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-shows">No shows available</p>
        )}

        <button onClick={() => navigate(`/booking/${movie._id}`)}>
          Book Seat →
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
