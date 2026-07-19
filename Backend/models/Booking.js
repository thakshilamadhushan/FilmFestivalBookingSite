const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movie",
        required: true
    },

    name:{
        type:String,
        required:true
    },

    studentYear: {
        type: String,
        required: true,
    },

    mobileNumber: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    timeSlot: {
        type: String,
        required: true
    },

    selectedSeats: [{
        type: String
    }],

    totalAmount: {
        type: Number,
        required: true
    },

    paymentType: {
        type: String,
        required: true
    },

    paymentSlip: {
        type: String,
        default: null
    },

    bookingStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Rejected"],
        default: "Pending"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("Booking",bookingSchema);