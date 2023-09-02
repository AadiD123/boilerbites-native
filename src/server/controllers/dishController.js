// const Dish = require("../models/Dish");
// const mongoose = require("mongoose");

// // get all ratings
// const getDishes = async (req, res) => {
//   const dish = await Dish.find({}).sort({ createdAt: -1 });

//   res.status(200).json(dish);
// };

// // get a single dish
// const getDish = async (req, res) => {
//   console.log("getDish");

//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No such dish" });
//   }

//   const dish = await Dish.findOne({ _id: id });

//   if (!dish) {
//     return res.status(404).json({ error: "No such dish" });
//   }

//   res.status(200).json(dish);
// };

// function isDishExists(dishId, connection) {
//   return new Promise((resolve, reject) => {
//     const query = 'SELECT COUNT(*) AS count FROM boilerbites.dishes WHERE id = ?';
//     connection.query(query, [dishId], (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(results[0].count > 0);
//       }
//     });
//   });
// }

// async function getAllDishesForLocation(req, res) {
//   try {    
//     const { location, date } = req.params; 
//     const url = "https://api.hfs.purdue.edu/menus/v2/locations/" + location + "/" + date;
//     try {
//       const response = await fetch(url);
//       if (response.status === 200) {
//           const jsonData = await response.json();
//           processMeals(jsonData.Meals)
//           .then(() => {
//               console.log('Processing completed.');
//           })
//           .catch((error) => {
//               console.error('Error processing meals:', error);
//           });
//       } else {
//           console.log("GET request failed. Status Code:", response.status);
//       }
//   } catch (error) {
//       console.error("Error fetching data:", error);
//   }
//     const dishes = await Dish.findAll({
//       where: {
//         location: location,
//       },
//     });

//     // Return the fetched dishes as a JSON response
//     res.status(200).json(dishes);
//   } catch (error) {
//     // Handle errors, e.g., send an error response
//     console.error('Error fetching dishes:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// // create a review
// const createDish = async (req, res) => {
//   const { dish, diningCourt, averageRating, numberOfRatings } = req.body;
//   // add to db

//   try {
//     const dishCreate = await Dish.create({
//       dish,
//       diningCourt,
//       station,
//       averageRating,
//       numberOfRatings,
//     });
//     res.status(200).json(dishCreate);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // delete a review
// const deleteDish = async (req, res) => {
//   console.log("deleteDish");
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No such dish" });
//   }

//   const dish = await Dish.findOneAndDelete({ _id: id });

//   if (!dish) {
//     return res.status(404).json({ error: "No such dish" });
//   }

//   res.status(200).json(dish);
// };

// // update
// const updateDish = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No such dish" });
//   }

//   const dish = await Dish.findByIdAndUpdate({ _id: id }, { ...req.body });

//   if (!dish) {
//     return res.status(404).json({ error: "No such dish" });
//   }

//   res.status(200).json(dish);
// };

const fetch = require('node-fetch');
const mysql = require('mysql');

const dbConnection = mysql.createConnection({
  host: "boilerbites-1.cjmepwltgjhe.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "purduepete"
});

async function hasPig(item) {
  const pigKeywords = ['pork', 'bacon', 'ham', 'sausage', 'lard'];
  for (const keyword of pigKeywords) {
    if (item["Name"].includes(keyword) || item["Ingredients"].includes(keyword)) {
      return true;
    }
  }
  return false;
}

async function hasCow(item) {
  const cowKeywords = [' beef ', ' steak ', ' veal ', ' brisket ', ' ribeye '];
  for (const keyword of cowKeywords) { 
    if (item["Name"].includes(keyword) || item["Ingredients"].includes(keyword)) {
      return true;
    }
  }
  return false;
}

async function addDish(id, station, connection) {
    const url = "https://api.hfs.purdue.edu/menus/v2/items/" + id;
    const headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
    };

    const response = await fetch(url, { headers });

    if (response.status === 200) {
        const jsonData = await response.json();

        const insertQuery = "INSERT INTO boilerbites.dishes (id, dish_name, station, vegetarian, vegan, pork, beef, gluten, nuts, calories, carbs, protein, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const data = [
            jsonData.ID,
            jsonData.Name,
            station,
            jsonData.IsVegetarian,
            jsonData.Allergens[11].Value,
            await hasPig(jsonData),
            await hasCow(jsonData),
            jsonData.Allergens[3].Value,
            jsonData.Allergens[9].Value || jsonData.Allergens[5].Value,
            jsonData.Nutrition[1].Value,
            jsonData.Nutrition[3].Value,
            jsonData.Nutrition[7].Value,
            jsonData.Nutrition[11].Value
        ];
        connection.query(insertQuery, data, (error) => {
            if (error) {
                console.error("Error inserting data:", error);
            } else {
                console.log("Data inserted successfully.");
            }
        });
    } else {
        console.log("GET request failed. Status Code:", response.status);
    }
}

function isDishExists(dishId, connection) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM boilerbites.dishes WHERE id = ?';
    connection.query(query, [dishId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
}

async function processMeals(meals) {
  dbConnection.connect()
  for (const meal of meals) {
    console.log(meal);
    if (meal["Status"] == "Open") {
      for (const station of meal["Stations"]) {
        for (const item of station["Items"]) {
          const dishId = item.ID;
          try {
            const exists = await isDishExists(dishId, dbConnection);

            if (!exists) {
              console.log(`Dish with ID ${dishId} doesn't exist in the database. Adding...`);
              await addDish(dishId, station.Name, dbConnection);
              console.log(`Dish with ID ${dishId} added to the database.`);
            }
          } catch (error) {
            console.error('Error processing dish:', error);
          }
        }
      }
    }
  }
  dbConnection.close();
}

async function fetchLocationData(req, res) {
  const { location, date } = req.params; 
  const url = "https://api.hfs.purdue.edu/menus/v2/locations/" + location + "/" + date;
  try {
      const response = await fetch(url);
      if (response.status === 200) {
          const jsonData = await response.json();
          processMeals(jsonData.Meals)
          .then(() => {
              console.log('Processing completed.');
          })
          .catch((error) => {
              console.error('Error processing meals:', error);
          });
      } else {
          console.log("GET request failed. Status Code:", response.status);
      }
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

module.exports = {
  // createDish,
  // getDish,
  // getDishes,
  // // getDCDishes,
  // getAllDishesForLocation,
  // deleteDish,
  // updateDish,
  fetchLocationData
};
