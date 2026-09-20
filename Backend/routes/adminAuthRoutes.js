const express = require("express");
const {
  adminLogin,
  verifyAdmin,
} = require("../controllers/adminAuthController.js");

const { protect, adminOnly } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/verify", protect, adminOnly, verifyAdmin);

module.exports = router;
