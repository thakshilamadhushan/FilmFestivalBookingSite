import { useEffect, useState } from "react";
import axios from "axios";
import "./movies.css";
import MovieCard from "./movieCard";

function Festival() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/movies`);

        setMovies(response.data.movies || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      }
    };

    fetchMovies();
  }, [API_URL]);

  return (
    <section className="festival" id="movies">
      <div className="festivalHeading">
        <div>
          <p>JUL 16–17, 2026</p>
          <h1>Festival Screenings</h1>
        </div>
        <h4>Students' Center - GWUIM</h4>
      </div>

      <div className="movieGrid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default Festival;
