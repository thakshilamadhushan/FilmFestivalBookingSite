const Show = require("../models/Show");

// Get all shows for a movie
exports.getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
    })
      .populate("movie")
      .sort({ date: 1, time: 1 });

    if (!shows || shows.length === 0) {
      return res.status(404).json({
        message: "No shows found for this movie",
      });
    }

    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get seats for a specific show
exports.getShowSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await Show.findById(showId).populate("movie");

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    res.status(200).json({
      showId: show._id,
      movie: show.movie,
      date: show.date,
      time: show.time,
      seats: show.seats || [],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get one specific show by movie + date + time
exports.getShow = async (req, res) => {
  try {
    const { movieId, date, time } = req.params;

    const show = await Show.findOne({
      movie: movieId,
      date: date,
      time: time,
    }).populate("movie");

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    res.status(200).json(show);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Create a new show
exports.createShow = async (req, res) => {
  try {
    const { movie, date, time, seats } = req.body;

    // Validate required fields
    if (!movie || !date || !time) {
      return res.status(400).json({
        message: "Movie, date and time are required",
      });
    }

    // Check whether the same show already exists
    const existingShow = await Show.findOne({
      movie,
      date,
      time,
    });

    if (existingShow) {
      return res.status(409).json({
        message: "A show already exists for this movie, date and time",
      });
    }

    const show = await Show.create({
      movie,
      date,
      time,
      seats: seats || [],
    });

    const populatedShow = await Show.findById(show._id).populate("movie");

    res.status(201).json(populatedShow);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Update a show
exports.updateShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const { movie, date, time, seats } = req.body;

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    // Update only provided fields
    if (movie !== undefined) show.movie = movie;
    if (date !== undefined) show.date = date;
    if (time !== undefined) show.time = time;
    if (seats !== undefined) show.seats = seats;

    await show.save();

    const updatedShow = await Show.findById(show._id).populate("movie");

    res.status(200).json(updatedShow);
  } catch (error) {
    // Duplicate movie + date + time
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A show already exists for this movie, date and time",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


// Delete a show
exports.deleteShow = async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    await Show.findByIdAndDelete(showId);

    res.status(200).json({
      message: "Show deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};