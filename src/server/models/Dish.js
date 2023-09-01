const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dishSchema = new Schema({
  dish: {
    type: String,
    required: true,
  },
  diningCourt: {
    type: String,
    required: true,
  },
  station: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numRatings: {
    type: Number,
    default: 0,
  },
  daysServed: [
    {
      type: String,
    }
  ]
});

const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;
