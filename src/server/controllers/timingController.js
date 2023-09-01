const Timing = require("../models/Timing");
const mongoose = require("mongoose");
// const {MongoClient} = require('mongodb');

// get all timings
const getTimings = async (req, res) => {
  const timing = await Timing.find({}).sort({ createdAt: -1 });

  res.status(200).json(timing);
};

// get a single timing
const getTiming = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such timing" });
  }

  const timing = await Timing.findById(id);

  if (!timing) {
    return res.status(404).json({ error: "No such timing" });
  }

  res.status(200).json(timing);
};

// const getDiningDishes = async (req, res) => {
//   const { year, month, day, diningCourt } = req.params;

//   const dishes = await Timing.find({ year, month, day, diningCourt }).sort({
//     createdAt: -1,
//   });

//   if (!dishes) {
//     return res.status(404).json({ error: "No dishes served at this time" });
//   }

//   res.status(200).json(dishes);
// };

const getTimingDishes = async (req, res) => {
  const { year, month, day, diningCourt, meal } = req.params;

  try {
    // await client.connect();
    const coll = mongoose.connection.collection("timings");
    const agg = [
      {
        $match: {
          // Add $match stage to filter based on time found
          year: Number(year),
          month: Number(month),
          day: Number(day),
          diningCourt: diningCourt,
          meal: meal,
        },
      },
      {
        $lookup: {
          from: "dishes",
          localField: "dishes",
          foreignField: "_id",
          as: "display",
        },
      },
    ];
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();
    // await client.close();
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    // await client.close();
    res.status(500).json({ error: "Error fetching data" });
  }
};

const createTiming = async (req, res) => {
  const { year, month, day, diningCourt, meal, dishes } = req.body;

  // add to db

  try {
    const timing = await Timing.create({
      year,
      month,
      day,
      diningCourt,
      meal,
      dishes,
    });
    res.status(200).json(timing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a review
const deleteTiming = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such timing" });
  }

  const timing = await Timing.findOneAndDelete({ _id: id });

  if (!timing) {
    return res.status(404).json({ error: "No such timing" });
  }

  res.status(200).json(timing);
};

// update
const updateTiming = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such timing" });
  }

  const timing = await Timing.findByIdAndUpdate({ _id: id }, { ...req.body });

  if (!timing) {
    return res.status(404).json({ error: "No such timing" });
  }

  res.status(200).json(timing);
};

module.exports = {
  createTiming,
  getTimings,
  getTiming,
  deleteTiming,
  updateTiming,
  getTimingDishes,
  // getDiningDishes,
};
