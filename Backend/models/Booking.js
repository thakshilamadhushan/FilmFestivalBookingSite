const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movie"
    },

    customerName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    phone:String,

    bookingDate:String,

    bookingTime:String,

    seats:[String],

    total:Number,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("Booking",bookingSchema);