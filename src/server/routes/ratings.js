const express = require("express");
const {
  createRating,
  getRatings,
  updateRating,
} = require("../controllers/ratingController");

const router = express.Router();

// GET all reviews
router.get("/:dish_id", getRatings);

// POST a review
router.post("/", createRating);

// UPDATE a review
router.patch("/:rating_id", updateRating);

module.exports = router;
