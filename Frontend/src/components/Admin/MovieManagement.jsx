import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, X, Calendar, Clock, Star } from "lucide-react";
import "./MovieManagement.css";

const MovieManagement = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    poster: "",
    imdb: "",
    genre: "",
    duration: "",
    language: "",
    dates: [],
    times: [],
  });

  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  const token = localStorage.getItem("adminToken");

  // =========================
  // GET MOVIES
  // =========================

  const fetchMovies = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/movies`);

      setMovies(response.data.movies || []);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      alert("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // =========================
  // FORM
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // ADD DATE
  // =========================

  const addDate = () => {
    if (!dateInput) return;

    if (formData.dates.includes(dateInput)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      dates: [...prev.dates, dateInput],
    }));

    setDateInput("");
  };

  const removeDate = (date) => {
    setFormData((prev) => ({
      ...prev,
      dates: prev.dates.filter((item) => item !== date),
    }));
  };

  // =========================
  // ADD TIME
  // =========================

  const addTime = () => {
    if (!timeInput) return;

    if (formData.times.includes(timeInput)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      times: [...prev.times, timeInput],
    }));

    setTimeInput("");
  };

  const removeTime = (time) => {
    setFormData((prev) => ({
      ...prev,
      times: prev.times.filter((item) => item !== time),
    }));
  };

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    setEditingMovie(null);

    setFormData({
      title: "",
      poster: "",
      imdb: "",
      genre: "",
      duration: "",
      language: "",
      dates: [],
      times: [],
    });

    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (movie) => {
    setEditingMovie(movie);

    setFormData({
      title: movie.title || "",
      poster: movie.poster || "",
      imdb: movie.imdb || "",
      genre: movie.genre || "",
      duration: movie.duration || "",
      language: movie.language || "",
      dates: movie.dates || [],
      times: movie.times || [],
    });

    setShowModal(true);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.poster ||
      !formData.imdb ||
      !formData.genre ||
      !formData.duration ||
      !formData.language
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (editingMovie) {
        await axios.put(
          `${API_URL}/api/movies/${editingMovie._id}`,
          formData,
          config,
        );

        alert("Movie updated successfully");
      } else {
        await axios.post(`${API_URL}/api/movies`, formData, config);

        alert("Movie added successfully");
      }

      setShowModal(false);

      await fetchMovies();
    } catch (error) {
      console.error("Movie save error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while saving movie",
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMovies((prev) => prev.filter((movie) => movie._id !== id));

      alert("Movie deleted successfully");
    } catch (error) {
      console.error("Delete movie error:", error);

      alert(error.response?.data?.message || "Failed to delete movie");
    }
  };

  return (
    <div className="movie-management">
      {/* HEADER */}

      <div className="movie-management-header">
        <div>
          <h2>Movie Management</h2>
          <p>Add, edit and manage festival movies and showtimes.</p>
        </div>

        <button className="add-movie-btn" onClick={openAddModal}>
          <Plus size={18} />
          Add Movie
        </button>
      </div>

      {/* MOVIES */}

      {loading ? (
        <div className="movie-loading">Loading movies...</div>
      ) : movies.length === 0 ? (
        <div className="empty-movies">
          <h3>No movies available</h3>
          <p>Add your first festival movie.</p>

          <button onClick={openAddModal}>
            <Plus size={18} />
            Add Movie
          </button>
        </div>
      ) : (
        <div className="admin-movie-grid">
          {movies.map((movie) => (
            <div className="admin-movie-card" key={movie._id}>
              {/* POSTER */}

              <div className="admin-movie-poster">
                <img src={movie.poster} alt={movie.title} />

                <div className="admin-rating">
                  <Star size={14} fill="currentColor" />
                  {movie.imdb}
                </div>

                <div className="movie-actions">
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(movie)}
                    title="Edit movie"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(movie._id)}
                    title="Delete movie"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              {/* INFO */}

              <div className="admin-movie-info">
                <h3>{movie.title}</h3>

                <span className="movie-genre">{movie.genre}</span>

                <div className="movie-meta">
                  <span>
                    <Clock size={14} />
                    {movie.duration}
                  </span>

                  <span>{movie.language}</span>
                </div>

                {/* DATES */}

                <div className="admin-show-info">
                  <strong>
                    <Calendar size={14} />
                    Dates
                  </strong>

                  <div className="show-tags">
                    {movie.dates?.map((date) => (
                      <span key={date}>{date}</span>
                    ))}
                  </div>
                </div>

                {/* TIMES */}

                <div className="admin-show-info">
                  <strong>
                    <Clock size={14} />
                    Showtimes
                  </strong>

                  <div className="show-tags">
                    {movie.times?.map((time) => (
                      <span key={time}>{time}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}

      {showModal && (
        <div className="movie-modal-overlay">
          <div className="movie-modal">
            <div className="movie-modal-header">
              <div>
                <h2>{editingMovie ? "Edit Movie" : "Add New Movie"}</h2>

                <p>
                  {editingMovie
                    ? "Update movie information"
                    : "Add a new festival movie"}
                </p>
              </div>

              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Movie Title *</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter movie title"
                  />
                </div>

                <div className="form-group">
                  <label>IMDb Rating *</label>

                  <input
                    type="number"
                    name="imdb"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.imdb}
                    onChange={handleChange}
                    placeholder="8.5"
                  />
                </div>

                <div className="form-group full">
                  <label>Poster URL *</label>

                  <input
                    type="url"
                    name="poster"
                    value={formData.poster}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Genre *</label>

                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    placeholder="Drama / Documentary"
                  />
                </div>

                <div className="form-group">
                  <label>Duration *</label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="2h 15m"
                  />
                </div>

                <div className="form-group">
                  <label>Language *</label>

                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="Sinhala"
                  />
                </div>
              </div>

              {/* DATES */}

              <div className="array-section">
                <label>Screening Dates</label>

                <div className="array-input">
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                  />

                  <button type="button" onClick={addDate}>
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                <div className="array-tags">
                  {formData.dates.map((date) => (
                    <span key={date}>
                      {date}

                      <button type="button" onClick={() => removeDate(date)}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* TIMES */}

              <div className="array-section">
                <label>Show Times</label>

                <div className="array-input">
                  <input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                  />

                  <button type="button" onClick={addTime}>
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                <div className="array-tags">
                  {formData.times.map((time) => (
                    <span key={time}>
                      {time}

                      <button type="button" onClick={() => removeTime(time)}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-movie-btn">
                  {editingMovie ? "Update Movie" : "Add Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieManagement;
