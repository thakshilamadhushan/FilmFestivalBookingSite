const express = require("express");

const {
  getBookings,
  updateBookingStatus,
  getStats,
  validateTicket,
} = require("../controllers/adminController.js");

const { protect, adminOnly } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/bookings", protect, adminOnly, getBookings);

router.patch("/bookings/:id/status", protect, adminOnly, updateBookingStatus);

router.get("/stats", protect, adminOnly, getStats);

router.post("/bookings/validate", protect, adminOnly, validateTicket);

module.exports = router;
