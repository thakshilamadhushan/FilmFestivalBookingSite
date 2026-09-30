const Movie = require("../models/Movie");
const Show = require("../models/Show");

// GET ALL MOVIES
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }).lean();

    const moviesWithShows = await Promise.all(
      movies.map(async (movie) => {
        const shows = await Show.find({
          movie: movie._id,
        })
          .select("_id date time")
          .sort({ date: 1, time: 1 })
          .lean();

        return {
          ...movie,
          shows,
        };
      }),
    );

    res.status(200).json({
      success: true,
      movies: moviesWithShows,
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
    const movie = await Movie.findById(req.params.id).lean();

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const shows = await Show.find({
      movie: movie._id,
    })
      .sort({
        date: 1,
        time: 1,
      })
      .lean();

    res.status(200).json({
      success: true,
      movie: {
        ...movie,
        shows,
      },
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
    const {
      title,
      poster,
      imdb,
      genre,
      duration,
      language,
      description,
      director,
      vote,
    } = req.body;

    if (
      !title ||
      !poster ||
      imdb === undefined ||
      !genre ||
      !duration ||
      !language ||
      !description ||
      !director ||
      !vote
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
      description,
      director,
      vote,
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
