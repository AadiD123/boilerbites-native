const Rating = require("../models/Rating");
const mongoose = require("mongoose");

// get all ratings
const getRatings = async (req, res) => {
  const rating = await Rating.find({}).sort({ createdAt: -1 });

  res.status(200).json(rating);
};

// get a single rating
const getRating = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such rating" });
  }

  const rating = await Rating.findById(id);

  if (!rating) {
    return res.status(404).json({ error: "No such rating" });
  }

  res.status(200).json(rating);
};

// create a review
const createRating = async (req, res) => {
  const { dish, stars } = req.body;

  // add to db

  try {
    const rating = await Rating.create({
      dish,
      stars
    });
    res.status(200).json(rating);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a review
const deleteRating = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such rating" });
  }

  const rating = await Rating.findOneAndDelete({ _id: id });

  if (!rating) {
    return res.status(404).json({ error: "No such rating" });
  }

  res.status(200).json(rating);
};

// update
const updateRating = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such rating" });
  }

  const rating = await Rating.findByIdAndUpdate({ _id: id }, { ...req.body });

  if (!rating) {
    return res.status(404).json({ error: "No such rating" });
  }

  res.status(200).json(rating);
};

module.exports = {
  createRating,
  getRatings,
  getRating,
  deleteRating,
  updateRating,
};
