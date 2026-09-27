import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  CalendarDays,
  Clock,
  Film,
  Users,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import "./Shows.css";

export default function Shows() {
  const API_URL = import.meta.env.VITE_API_URL;
  const TOTAL_SEATS = Number(import.meta.env.VITE_TOTAL_SEATS);

  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [seatModal, setSeatModal] = useState(false);

  const [editingShow, setEditingShow] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  const [formData, setFormData] = useState({
    movie: "",
    date: "",
    time: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // --------------------------------------------------
  // FETCH SHOWS
  // --------------------------------------------------

  const fetchShows = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/shows`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch shows");
      }

      setShows(data.shows || []);
    } catch (error) {
      console.error("Fetch shows error:", error);

      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FETCH MOVIES
  // --------------------------------------------------

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/movies`);

      const data = await response.json();

      if (Array.isArray(data)) {
        setMovies(data);
      } else {
        setMovies(data.movies || []);
      }
    } catch (error) {
      console.error("Fetch movies error:", error);
    }
  };

  useEffect(() => {
    fetchShows();
    fetchMovies();
  }, []);

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredShows = useMemo(() => {
    return shows.filter((show) => {
      const movieTitle = show.movie?.title?.toLowerCase() || "";

      const matchesSearch = movieTitle.includes(search.toLowerCase());

      const matchesDate = !dateFilter || show.date === dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [shows, search, dateFilter]);

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingShow(null);

    setFormData({
      movie: "",
      date: "",
      time: "",
    });

    setMessage({
      type: "",
      text: "",
    });

    setShowModal(true);
  };

  const openEditModal = (show) => {
    setEditingShow(show);

    setFormData({
      movie: show.movie?._id || show.movie || "",
      date: show.date || "",
      time: show.time || "",
    });

    setMessage({
      type: "",
      text: "",
    });

    setShowModal(true);
  };

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.movie || !formData.date || !formData.time) {
      setMessage({
        type: "error",
        text: "Movie, date and time are required.",
      });

      return;
    }

    try {
      setActionLoading(true);

      const url = editingShow
        ? `${API_URL}/api/shows/${editingShow._id}`
        : `${API_URL}/api/shows`;

      const method = editingShow ? "PUT" : "POST";

      const body = editingShow
        ? {
            movie: formData.movie,
            date: formData.date,
            time: formData.time,
          }
        : {
            movie: formData.movie,
            date: formData.date,
            time: formData.time,
            seats: [],
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Action failed");
      }

      setShowModal(false);

      await fetchShows();

      setMessage({
        type: "success",
        text: editingShow
          ? "Show updated successfully."
          : "Show created successfully.",
      });
    } catch (error) {
      console.error("Show save error:", error);

      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (show) => {
    const movieTitle = show.movie?.title || "this movie";

    const confirmed = window.confirm(
      `Delete the ${movieTitle} show on ${show.date} at ${show.time}?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await fetch(`${API_URL}/api/shows/${show._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete show");
      }

      await fetchShows();

      setMessage({
        type: "success",
        text: "Show deleted successfully.",
      });
    } catch (error) {
      console.error("Delete show error:", error);

      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // SEAT VIEW
  // --------------------------------------------------

  const openSeatModal = (show) => {
    setSelectedShow(show);
    setSeatModal(true);
  };

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const totalShows = shows.length;

  const totalOccupied = shows.reduce(
    (total, show) => total + (show.seats?.length || 0),
    0,
  );

  const totalAvailable = shows.reduce(
    (total, show) => total + (TOTAL_SEATS - (show.seats?.length || 0)),
    0,
  );

  return (
    <section className="shows-section">
      {/* HEADER */}
      <div className="shows-header">
        <div>
          <h1>Shows</h1>
          <p>Manage movie screening dates, times and seats.</p>
        </div>

        <div className="shows-header-actions">
          <button
            className="shows-refresh-btn"
            onClick={fetchShows}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button className="shows-add-btn" onClick={openCreateModal}>
            <Plus size={18} />
            Add Show
          </button>
        </div>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div className={`shows-message ${message.type}`}>
          {message.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span>{message.text}</span>

          <button
            onClick={() =>
              setMessage({
                type: "",
                text: "",
              })
            }
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="shows-stats">
        <div className="show-stat-card">
          <div className="show-stat-icon">
            <Film size={21} />
          </div>

          <div>
            <span>Total Shows</span>
            <strong>{totalShows}</strong>
          </div>
        </div>

        <div className="show-stat-card">
          <div className="show-stat-icon">
            <Users size={21} />
          </div>

          <div>
            <span>Occupied Seats</span>
            <strong>{totalOccupied}</strong>
          </div>
        </div>

        <div className="show-stat-card">
          <div className="show-stat-icon">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Available Seats</span>
            <strong>{totalAvailable}</strong>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="shows-toolbar">
        <div className="shows-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="shows-date-filter">
          <CalendarDays size={17} />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {dateFilter && (
          <button
            className="clear-filter-btn"
            onClick={() => setDateFilter("")}
          >
            Clear
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="shows-table-card">
        {loading ? (
          <div className="shows-state">
            <RefreshCw className="loading-icon" size={25} />
            <p>Loading shows...</p>
          </div>
        ) : filteredShows.length === 0 ? (
          <div className="shows-state">
            <Film size={35} />
            <h3>No shows found</h3>
            <p>Create a new show or change your filters.</p>
          </div>
        ) : (
          <div className="shows-table-wrapper">
            <table className="shows-table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredShows.map((show) => {
                  const occupied = show.seats?.length || 0;
                  const available = TOTAL_SEATS - occupied;

                  return (
                    <tr key={show._id}>
                      <td>
                        <div className="show-movie">
                          {show.movie?.poster ? (
                            <img
                              src={show.movie.poster}
                              alt={show.movie.title}
                            />
                          ) : (
                            <div className="show-movie-placeholder">
                              <Film size={18} />
                            </div>
                          )}

                          <div>
                            <strong>
                              {show.movie?.title || "Unknown Movie"}
                            </strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="show-info">
                          <CalendarDays size={15} />
                          {show.date}
                        </div>
                      </td>

                      <td>
                        <div className="show-info">
                          <Clock size={15} />
                          {show.time}
                        </div>
                      </td>

                      <td>
                        <span className="seat-count">
                          {occupied} / {TOTAL_SEATS}
                        </span>
                      </td>

                      <td>
                        <div className="availability">
                          <div className="availability-bar">
                            <div
                              className="availability-fill"
                              style={{
                                width: `${Math.min(
                                  (occupied / TOTAL_SEATS) * 100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>

                          <span>{available} available</span>
                        </div>
                      </td>

                      <td>
                        <div className="show-actions">
                          <button
                            className="action-view"
                            title="View seats"
                            onClick={() => openSeatModal(show)}
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            className="action-edit"
                            title="Edit show"
                            onClick={() => openEditModal(show)}
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            className="action-delete"
                            title="Delete show"
                            onClick={() => handleDelete(show)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="shows-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="shows-modal" onClick={(e) => e.stopPropagation()}>
            <div className="shows-modal-header">
              <div>
                <h2>{editingShow ? "Edit Show" : "Add New Show"}</h2>

                <p>
                  {editingShow
                    ? "Update screening information."
                    : "Create a new movie screening."}
                </p>
              </div>

              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="show-form" onSubmit={handleSubmit}>
              <div className="show-form-group">
                <label>Movie</label>

                <select
                  name="movie"
                  value={formData.movie}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Movie</option>

                  {movies.map((movie) => (
                    <option key={movie._id} value={movie._id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="show-form-row">
                <div className="show-form-group">
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="show-form-group">
                  <label>Time</label>

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {!editingShow && (
                <div className="show-form-note">
                  <AlertCircle size={16} />
                  New shows start with all seats available.
                </div>
              )}

              <div className="show-form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-show-btn"
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Saving..."
                    : editingShow
                      ? "Update Show"
                      : "Create Show"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEAT MAP MODAL */}
      {seatModal && selectedShow && (
        <SeatMapModal
          show={selectedShow}
          onClose={() => {
            setSeatModal(false);
            setSelectedShow(null);
          }}
        />
      )}
    </section>
  );
}

// ==================================================
// SEAT MAP MODAL
// ==================================================

function SeatMapModal({ show, onClose }) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const occupiedSeats = show.seats || [];

  return (
    <div className="shows-modal-overlay" onClick={onClose}>
      <div className="seat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shows-modal-header">
          <div>
            <h2>{show.movie?.title}</h2>

            <p>
              {show.date} • {show.time}
            </p>
          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="seat-summary">
          <div>
            <span>Occupied</span>
            <strong>{occupiedSeats.length}</strong>
          </div>

          <div>
            <span>Available</span>
            <strong>{80 - occupiedSeats.length}</strong>
          </div>
        </div>

        <div className="admin-screen">SCREEN</div>

        <div className="admin-seat-layout">
          {rows.map((row) => (
            <div className="admin-seat-row" key={row}>
              <span className="admin-row-label">{row}</span>

              {columns.map((column) => {
                const seat = `${row}${column}`;
                const occupied = occupiedSeats.includes(seat);

                return (
                  <div
                    key={seat}
                    className={`admin-seat ${
                      occupied ? "occupied" : "available"
                    }`}
                    title={
                      occupied ? `${seat} - Occupied` : `${seat} - Available`
                    }
                  >
                    {column}
                  </div>
                );
              })}

              <span className="admin-row-label">{row}</span>
            </div>
          ))}
        </div>

        <div className="seat-legend">
          <div>
            <span className="legend-box available" />
            Available
          </div>

          <div>
            <span className="legend-box occupied" />
            Occupied
          </div>
        </div>
      </div>
    </div>
  );
}
