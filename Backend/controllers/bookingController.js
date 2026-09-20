const Booking = require("../models/Booking");
const Show = require("../models/Show");

exports.createBooking = async (req, res) => {
  try {
    const selectedSeats = JSON.parse(req.body.selectedSeats);

    const {
      movie,
      name,
      studentYear,
      mobileNumber,
      date,
      timeSlot,
      totalAmount,
      paymentType,
      agentCode,
    } = req.body;

    // Validate Agent Code when payment method is "Meet Agent"
    if (paymentType === "Meet Agent") {
      if (!agentCode?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Agent Code is required.",
        });
      }

      if (agentCode.trim() !== process.env.AGENT_CODE) {
        return res.status(400).json({
          success: false,
          message: "Invalid Agent Code.",
        });
      }
    }

    // Payment slip is required for Bank Payment
    if (paymentType === "Bank Payment" && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment slip is required.",
      });
    }

    const booking = new Booking({
      bookingId: "FFF" + Date.now().toString().slice(-6),

      movie,
      name,
      studentYear,
      mobileNumber,
      date,
      timeSlot,
      selectedSeats,
      totalAmount,
      paymentType,

      // Cloudinary URL
      paymentSlip: req.file ? req.file.path : null,
    });

    await booking.save();

    // UPDATE OCCUPIED SEATS
    const updatedShow = await Show.findOneAndUpdate(
      {
        movie,
        seats: {
          $nin: selectedSeats,
        },
      },
      {
        $push: {
          seats: {
            $each: selectedSeats,
          },
        },
      },
      {
        returnDocument: "after",
      },
    );

    if (!updatedShow) {
      return res.status(400).json({
        success: false,
        message: "Some seats are already booked.",
      });
    }

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBookingByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;

    const bookings = await Booking.find({
      mobileNumber: mobile,
    }).populate("movie");

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found",
      });
    }

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
