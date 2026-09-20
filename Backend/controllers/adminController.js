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
      }
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
          bookingStatus: {
            $ne: "Rejected",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSeats: {
            $sum: "$seats",
          },
        },
      },
    ]);

    const seatsBooked =
      seatsResult.length > 0 ? seatsResult[0].totalSeats : 0;

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