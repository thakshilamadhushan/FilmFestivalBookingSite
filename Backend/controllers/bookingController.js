const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {

    try {

        const booking = new Booking({

            movie: req.body.movie,

            name: req.body.name,

            studentYear: req.body.studentYear,

            mobileNumber: req.body.mobileNumber,

            date: req.body.date,

            timeSlot: req.body.timeSlot,

            selectedSeats: req.body.selectedSeats,

            totalAmount: req.body.totalAmount,

            paymentType: req.body.paymentType,

            paymentSlip: req.file ? req.file.filename : null

        });

        await booking.save();

        res.status(201).json({
            success: true,
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};