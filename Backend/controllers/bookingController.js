const Booking = require("../models/Booking");
const Show = require("../models/Show");

exports.createBooking = async (req, res) => {

    const selectedSeats = JSON.parse(req.body.selectedSeats);

    try {

        const booking = new Booking({

            bookingId: "FFF" + Date.now().toString().slice(-6),
            movie: req.body.movie,
            name: req.body.name,
            studentYear: req.body.studentYear,
            mobileNumber: req.body.mobileNumber,
            date: req.body.date,
            timeSlot: req.body.timeSlot,
            selectedSeats: selectedSeats,
            totalAmount: req.body.totalAmount,
            paymentType: req.body.paymentType,
            paymentSlip: req.file ? req.file.filename : null
        });

        await booking.save();

        // UPDATE OCCUPIED SEATS
        const updatedShow = await Show.findOneAndUpdate(
            {
                movie:req.body.movie,
                seats:{
                    $nin:selectedSeats
                }
            },
            {
                $push:{
                    seats:{
                        $each:selectedSeats
                    }
                }
            },
            {
                returnDocument: "after"
            }
        );


        if(!updatedShow){

            return res.status(400).json({
                success:false,
                message:"Some seats are already booked"
            });

        }

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


exports.getBookingByMobile = async (req, res) => {

    try {

        const { mobile } = req.params;

        const bookings = await Booking.find({
            mobileNumber: mobile
        }).populate("movie");

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found"
            });
        }

        res.status(200).json({
            success: true,
            bookings
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};