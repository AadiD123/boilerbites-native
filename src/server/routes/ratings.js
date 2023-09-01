const express = require("express");
const {
  createRating,
  getRatings,
  getRating,
  deleteRating,
  updateRating,
} = require("../controllers/ratingController");

const router = express.Router();

// GET all reviews
router.get("/", getRatings);

// GET single review
router.get("/:id", getRating);

// POST a review
router.post("/", createRating);

// DELETE a review
router.delete("/:id", deleteRating);

// UPDATE a review
router.patch("/:id", updateRating);

module.exports = router;
