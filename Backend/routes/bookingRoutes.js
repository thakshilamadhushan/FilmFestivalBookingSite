const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");


const {createBooking, getBookingByMobile}=require("../controllers/bookingController");

// Booking form submit
router.post(
    "/",
    upload.single("paymentSlip"),
    createBooking
);

// Get booking by mobile number
router.get(
    "/ticket/:mobile",
    getBookingByMobile
);

module.exports=router;