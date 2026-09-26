const Movie = require("../models/Movie");

// GET ALL MOVIES
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error("Get movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
    });
  }
};

// GET SINGLE MOVIE
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("Get movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movie",
    });
  }
};

// CREATE MOVIE
const createMovie = async (req, res) => {
  try {
    const { title, poster, imdb, genre, duration, language, dates, times } =
      req.body;

    if (
      !title ||
      !poster ||
      imdb === undefined ||
      !genre ||
      !duration ||
      !language
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const movie = await Movie.create({
      title,
      poster,
      imdb,
      genre,
      duration,
      language,
      dates: dates || [],
      times: times || [],
    });

    res.status(201).json({
      success: true,
      message: "Movie added successfully",
      movie,
    });
  } catch (error) {
    console.error("Create movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create movie",
    });
  }
};

// UPDATE MOVIE
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const { title, poster, imdb, genre, duration, language, dates, times } =
      req.body;

    movie.title = title;
    movie.poster = poster;
    movie.imdb = imdb;
    movie.genre = genre;
    movie.duration = duration;
    movie.language = language;
    movie.dates = dates || [];
    movie.times = times || [];

    await movie.save();

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    console.error("Update movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update movie",
    });
  }
};

// DELETE MOVIE
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Delete movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete movie",
    });
  }
};
module.exports = {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};
