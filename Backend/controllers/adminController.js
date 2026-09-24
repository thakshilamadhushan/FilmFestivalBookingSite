const Booking = require("../models/Booking");

// GET all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("movie", "title")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// UPDATE booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    if (!["Pending", "Confirmed", "Rejected"].includes(bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { bookingStatus },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking ${bookingStatus.toLowerCase()} successfully`,
      booking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};

// GET dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const pending = await Booking.countDocuments({
      bookingStatus: "Pending",
    });

    const confirmed = await Booking.countDocuments({
      bookingStatus: "Confirmed",
    });

    const rejected = await Booking.countDocuments({
      bookingStatus: "Rejected",
    });

    const seatsResult = await Booking.aggregate([
      {
        $match: {
          bookingStatus: "Confirmed",
        },
      },
      {
        $project: {
          seatCount: {
            $size: {
              $ifNull: ["$selectedSeats", []],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSeats: {
            $sum: "$seatCount",
          },
        },
      },
    ]);

    const seatsBooked = seatsResult.length > 0 ? seatsResult[0].totalSeats : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pending,
        confirmed,
        rejected,
        seatsBooked,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

exports.validateTicket = async (req, res) => {
  try {
    const {
      bookingId,
      name,
      mobileNumber,
      movie,
    } = req.body;

    {/*console.log("Validation request:", {
      bookingId,
      name,
      mobileNumber,
      movie,
    });*/}

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required.",
      });
    }

    const booking = await Booking.findOne({
      bookingId: bookingId.trim(),
    }).populate("movie", "title");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    // Only confirmed bookings can be validated
    if (booking.bookingStatus !== "Confirmed") {
      return res.status(400).json({
        message: `Ticket cannot be validated. Booking status is ${booking.bookingStatus}.`,
      });
    }

    // QR validation
    // Only perform these checks when QR data was supplied.
    if (name || mobileNumber || movie) {
      const nameMatches =
        booking.name?.trim().toLowerCase() ===
        String(name || "").trim().toLowerCase();

      const mobileMatches =
        booking.mobileNumber?.trim() ===
        String(mobileNumber || "").trim();

      const movieMatches =
        booking.movie?.title?.trim().toLowerCase() ===
        String(movie || "").trim().toLowerCase();

      if (!nameMatches) {
        return res.status(400).json({
          message: "Name does not match the booking.",
        });
      }

      if (!mobileMatches) {
        return res.status(400).json({
          message: "Mobile number does not match the booking.",
        });
      }

      if (!movieMatches) {
        return res.status(400).json({
          message: "Movie does not match the booking.",
        });
      }
    }

    // Already validated
    if (booking.ticketValidated) {
      return res.status(409).json({
        message: "This ticket has already been validated.",
        booking: {
          bookingId: booking.bookingId,
          name: booking.name,
          mobile: booking.mobileNumber,
          movie: booking.movie?.title || "",
          seats: booking.selectedSeats || [],
          bookingStatus: booking.bookingStatus,
          ticketValidated: true,
          validatedAt: booking.validatedAt,
        },
      });
    }

    // Mark ticket as used
    booking.ticketValidated = true;
    booking.validatedAt = new Date();

    await booking.save();

    return res.status(200).json({
      message: "Ticket verified successfully.",

      booking: {
        bookingId: booking.bookingId,
        name: booking.name,
        mobile: booking.mobileNumber,
        movie: booking.movie?.title || "",

        // IMPORTANT:
        // Seats come from MongoDB, NOT QR
        seats: booking.selectedSeats || [],

        bookingStatus: booking.bookingStatus,
        ticketValidated: booking.ticketValidated,
        validatedAt: booking.validatedAt,
      },
    });
  } catch (error) {
    console.error("Validate ticket error:", error);

    return res.status(500).json({
      message: "Server error while validating ticket.",
    });
  }
};