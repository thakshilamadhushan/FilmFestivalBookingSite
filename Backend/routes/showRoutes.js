const express = require("express");
const router = express.Router();

const {
  getShowsByMovie,
  getShowSeats,
  getShow,
  createShow,
  updateShow,
  deleteShow,
} = require("../controllers/showController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ===============================
// PUBLIC ROUTES
// ===============================

// Get all shows for a movie
// GET /api/shows/movie/:movieId
router.get("/movie/:movieId", getShowsByMovie);

// Get one specific show
// GET /api/shows/:showId
router.get("/:showId", getShow);

// Get occupied seats for a specific show
// GET /api/shows/:showId/seats
router.get("/:showId/seats", getShowSeats);


// ===============================
// ADMIN ROUTES
// ===============================

// Create a show
// POST /api/shows
router.post("/", protect, adminOnly, createShow);

// Update a show
// PUT /api/shows/:showId
router.put("/:showId", protect, adminOnly, updateShow);

// Delete a show
// DELETE /api/shows/:showId
router.delete("/:showId", protect, adminOnly, deleteShow);

module.exports = router;