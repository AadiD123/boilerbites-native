const express = require("express");

const {
  getDiningCourtRating,
  getDiningTiming,
} = require("../controllers/diningController");

const router = express.Router();

router.use((req, res, next) => {
  req.db = req.app.locals.db;
  next();
});

router.get("/rating/:location/:date", getDiningCourtRating);
router.get("/timing/:location/:date/:time", getDiningTiming);

module.exports = router;
