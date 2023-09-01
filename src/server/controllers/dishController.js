const Dish = require("../models/Dish");
const mongoose = require("mongoose");

// get all ratings
const getDishes = async (req, res) => {
  const dish = await Dish.find({}).sort({ createdAt: -1 });

  res.status(200).json(dish);
};

// get a single dish
const getDish = async (req, res) => {
  console.log("getDish");

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such dish" });
  }

  const dish = await Dish.findOne({ _id: id });

  if (!dish) {
    return res.status(404).json({ error: "No such dish" });
  }

  res.status(200).json(dish);
};

// const getDCDishes = async (req, res) => {
//   const { diningCourt } = req.params;

//   const dishes = await Dish.find({ diningCourt }).sort({ createdAt: -1 });

//   if (!dishes) {
//     return res.status(404).json({ error: "No such dining Court" });
//   }

//   res.status(200).json(dishes);
// };

// create a review
const createDish = async (req, res) => {
  const { dish, diningCourt, averageRating, numberOfRatings } = req.body;

  // add to db

  try {
    const dishCreate = await Dish.create({
      dish,
      diningCourt,
      station,
      averageRating,
      numberOfRatings,
    });
    res.status(200).json(dishCreate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a review
const deleteDish = async (req, res) => {
  console.log("deleteDish");
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such dish" });
  }

  const dish = await Dish.findOneAndDelete({ _id: id });

  if (!dish) {
    return res.status(404).json({ error: "No such dish" });
  }

  res.status(200).json(dish);
};

// update
const updateDish = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such dish" });
  }

  const dish = await Dish.findByIdAndUpdate({ _id: id }, { ...req.body });

  if (!dish) {
    return res.status(404).json({ error: "No such dish" });
  }

  res.status(200).json(dish);
};

module.exports = {
  createDish,
  getDish,
  getDishes,
  // getDCDishes,
  deleteDish,
  updateDish,
};
