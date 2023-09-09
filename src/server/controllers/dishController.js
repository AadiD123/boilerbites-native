const fetch = require("node-fetch");

async function hasPig(item) {
  const pigKeywords = ["pork", "bacon", "ham", "sausage", "lard"];
  for (const keyword of pigKeywords) {
    if (
      item["Name"].toLowerCase().includes(keyword) ||
      item["Ingredients"].toLowerCase().includes(keyword)
    ) {
      return true;
    }
  }
  return false;
}

async function hasCow(item) {
  const cowKeywords = ["beef", "steak", "veal", "brisket", "ribeye"];
  for (const keyword of cowKeywords) {
    if (
      item["Name"].toLowerCase().includes(keyword) ||
      item["Ingredients"].toLowerCase().includes(keyword)
    ) {
      return true;
    }
  }
  return false;
}

// async function addDish(id, pool) {
//   const url = "https://api.hfs.purdue.edu/menus/v2/items/" + id;
//   const headers = {
//     "User-Agent":
//       "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
//   };

//   const response = await fetch(url, { headers });

//   if (response.status === 200) {
//     const jsonData = await response.json();

//     const insertQuery =
//       "INSERT INTO boilerbites.dishes (id, dish_name, vegetarian, vegan, pork, beef, gluten, nuts, calories, carbs, protein, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//     const data = [
//       jsonData.ID,
//       jsonData.Name,
//       jsonData.IsVegetarian,
//       jsonData.Allergens[11].Value,
//       !jsonData.IsVegetarian && (await hasPig(jsonData)),
//       !jsonData.IsVegetarian && (await hasCow(jsonData)),
//       jsonData.Allergens[3].Value,
//       jsonData.Allergens[9].Value || jsonData.Allergens[5].Value,
//       jsonData.Nutrition[1].Value,
//       jsonData.Nutrition[3].Value,
//       jsonData.Nutrition[7].Value,
//       jsonData.Nutrition[11].Value,
//     ];

//     const connection = await pool.getConnection();

//     try {
//       await connection.query(insertQuery, data);
//       console.log("successfully inserted data");
//     } catch (error) {
//       console.error("Error inserting data:", error);
//     } finally {
//       connection.release();
//     }
//   } else {
//     console.log("GET request failed. Status Code:", response.status);
//   }
// }

async function isDishExists(dishId, pool) {
  const query = "SELECT COUNT(*) AS count FROM boilerbites.dishes WHERE id = ?";
  const connection = await pool.getConnection();

  try {
    const results = await connection.query(query, [dishId]);
    return results[0].count > 0;
  } catch (error) {
    console.error("Error checking dish existence:", error);
    return false;
  } finally {
    connection.release();
  }
}

async function processMeals(data, pool) {
  for (const meal of data.Meals) {
    if (meal.Status === "Open") {
      for (const station of meal.Stations) {
        for (const item of station.Items) {
          const dishId = item.ID;
          const exists = await isDishExists(dishId, pool);

          if (!exists) {
            const url = "https://api.hfs.purdue.edu/menus/v2/items/" + dishId;
            const headers = {
              "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
            };

            const response = await fetch(url, { headers });

            if (response.status === 200) {
              const jsonData = await response.json();

              const insertQuery =
                "INSERT INTO boilerbites.dishes (id, dish_name, vegetarian, vegan, pork, beef, gluten, nuts, calories, carbs, protein, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
              const data = [
                jsonData.ID,
                jsonData.Name,
                jsonData.IsVegetarian,
                jsonData.Allergens[11].Value,
                !jsonData.IsVegetarian && (await hasPig(jsonData)),
                !jsonData.IsVegetarian && (await hasCow(jsonData)),
                jsonData.Allergens[3].Value,
                jsonData.Allergens[9].Value || jsonData.Allergens[5].Value,
                jsonData.Nutrition[1].Value,
                jsonData.Nutrition[3].Value,
                jsonData.Nutrition[7].Value,
                jsonData.Nutrition[11].Value,
              ];

              const connection = await pool.getConnection();

              try {
                await connection.query(insertQuery, data);
                console.log(`Successfully inserted data for dish with ID ${dishId}`);
              } catch (error) {
                console.error(`Error inserting data for dish with ID ${dishId}:`, error);
              } finally {
                connection.release();
              }
            } else {
              console.log(`GET request failed for dish with ID ${dishId}. Status Code:`, response.status);
            }
          } else {
            console.log(`Dish with ID ${dishId} already exists. Skipping insertion.`);
          }
        }
      }
    }
  }
}
// async function getLocationData(req, res) {
//   const { location, date } = req.params;
//   const filters = {
//     vegetarian: "vegetarian = true",
//     vegan: "vegan = true",
//     "no beef": "beef = false",
//     "no pork": "pork = false",
//     "gluten-free": "gluten = false",
//   };
//   const db = req.db;
//   var restrictions = req.query.restrict;
//   restrictions = restrictions.split(",");
//   var query = "SELECT id FROM boilerbites.dishes WHERE ";
//   for (var r in restrictions) {
//     query += filters[restrictions[r]];
//     if (parseInt(r) !== restrictions.length - 1) {
//       query += " AND ";
//     }
//   }
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error("Error querying dishes:", error);
//     } else {
//       var ids = [];
//       for (var i in results) {
//         ids.push(results[i].id);
//       }
//       console.log(ids);
//     }});
//   const url =
//     "https://api.hfs.purdue.edu/menus/v2/locations/" + location + "/" + date;
//   try {
//     const response = await fetch(url);
//     if (response.status === 200) {
//       const jsonData = await response.json();
//       processMeals(jsonData, db)
//         .then(() => {
//           console.log("Processing completed.");
//         })
//         .catch((error) => {
//           console.error("Error processing meals:", error);
//         });
//       res.json(jsonData);
//     } else {
//       console.log("GET request failed. Status Code:", response.status);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

async function getLocationData(req, res) {
  const { location, date } = req.params;
  const filters = {
    vegetarian: "vegetarian = true",
    vegan: "vegan = true",
    "no beef": "beef = false",
    "no pork": "pork = false",
    "gluten-free": "gluten = false",
  };
  const pool = req.app.locals.pool; // Use the pool from app.locals
  const restrictions = req.query.restrict?.split(",") || [];
  const url = `https://api.hfs.purdue.edu/menus/v2/locations/${location}/${date}`;

  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const jsonData = await response.json();

      const [_, dishIds] = await Promise.all([
        processMeals(jsonData, pool), // Use the pool here
        getDishIds(jsonData),
      ]);
      const dishes = await fetchRatingsForDishes(dishIds, pool);
      const finalDishData = enhanceDishData(jsonData, dishes);

      res.json(finalDishData);
    } else {
      console.log("GET request failed. Status Code:", response.status);
      res.status(response.status).send("Failed to fetch data.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
}


async function getDishIds(jsonData) {
  const dishIds = [];
  jsonData.Meals.forEach((meal) => {
    meal.Stations.forEach((station) => {
      station.Items.forEach((item) => {
        dishIds.push(item.ID);
      });
    });
  });
  return dishIds;
}

async function fetchRatingsForDishes(dishIds, pool) {
  const connection = await pool.getConnection();
  const dishes = [];
  for (const id of dishIds) {
    try {
      const [results] = await connection.execute(`SELECT AVG(stars) as average_stars, COUNT(*) as numRows FROM boilerbites.ratings WHERE dish_id = ?`, [id]);

      connection.release();

      const ratingJson = results[0];
      dishes.push({
        id,
        avg: ratingJson.average_stars || 0,
        reviews: ratingJson.numRows || 0,
      });
    } catch (err) {
      console.error("Error fetching rating:", err);
    }
  }
  connection.release();
  return dishes;
}

function enhanceDishData(mealData, dishes) {
  return mealData.Meals.map((meal) => {
    const mealName = meal.Name;
    const stations = meal.Stations.map((station) => {
      const stationName = station.Name;
      const items = station.Items.map((item) => {
        const itemId = item.ID;
        const dishName = item.Name;
        const dish = dishes.find((d) => d.id === item.ID);
        return { id: itemId, dish_name: dishName, avg: dish.avg, reviews: dish.reviews };
      });

      return { station_name: stationName, items };
    });
    return {
      meal_name: mealName,
      stations,
    };
  });
}
module.exports = {
  getLocationData,
};
