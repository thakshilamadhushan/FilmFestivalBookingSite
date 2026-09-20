const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "FilmBooking/payment-slips",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

const uploadPaymentSlip = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = uploadPaymentSlip;