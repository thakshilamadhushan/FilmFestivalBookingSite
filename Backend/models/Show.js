const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    seats: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent the same movie from having
// duplicate date + time shows
showSchema.index(
  {
    movie: 1,
    date: 1,
    time: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Show", showSchema);
