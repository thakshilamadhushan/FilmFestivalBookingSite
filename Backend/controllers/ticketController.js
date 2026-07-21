exports.getTicketByMobile = async (req, res) => {
    try {
        const mobile = req.params.mobile;

        console.log("Searching:", mobile);

        const booking = await Booking.findOne({
            mobileNumber: mobile
        }).populate("movie");

        if (!booking) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        res.json(booking);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};