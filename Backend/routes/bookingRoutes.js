const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");


const {
    createBooking
}=require("../controllers/bookingController");



// Booking form submit
router.post(
    "/",
    upload.single("paymentSlip"),
    createBooking
);



module.exports=router;