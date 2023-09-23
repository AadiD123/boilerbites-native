const express = require("express");
const {
  createRating,
  getRatings,
  updateRating,
  deleteRating
} = require("../controllers/ratingController");

const router = express.Router();

// GET all reviews
router.get("/:dish_id", getRatings);

// POST a review
router.post("/", createRating);

// UPDATE a review
router.patch("/patch/:rating_id", updateRating);

router.delete("/del/:rating_id", deleteRating);

module.exports = router;
