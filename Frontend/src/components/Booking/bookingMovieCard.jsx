import "./bookingMovieCard.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function MovieCard() {

  const { id } = useParams();

  const [movie, setMovie] = useState(null);

  useEffect(() => {

      fetch(`http://localhost:5000/api/movies/${id}`)
          .then(res => res.json())
          .then(data => setMovie(data));

  }, [id]);

  if (!movie) {
      return <h2>Loading...</h2>;
  }
  
  return (
    <div className="movie-card card">

      <div className="movie-image">
        <img
          src={movie.poster}
          alt={movie.title}
        />
      </div>

      <div className="movie-content">


        <h1>{movie.title}</h1>

        <p className="genre">
          {movie.genre}
        </p>

        <p className="description">
          {movie.description}
        </p>

        <div className="movie-info">

          <div>
            <small>DIRECTOR</small>
            <h4>{movie.director}</h4>
          </div>

          <div>
            <small>DURATION</small>
            <h4>{movie.duration}</h4>
          </div>

          <div>
            <small>HALL</small>
            <h4>Students' Center</h4>
          </div>

          <div>
            <small>LANGUAGE</small>
            <h4>{movie.language}</h4>
          </div>

        </div>

        <div className="movierating">

          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />

          <span>{movie.imdb}</span>

          <small>({movie.vote})</small>

        </div>

      </div>

    </div>
  );
}