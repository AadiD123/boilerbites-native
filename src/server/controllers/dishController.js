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

async function addDishIfNotExists(id, pool) {
  const url = "https://api.hfs.purdue.edu/menus/v2/items/" + id;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
  };

  const response = await fetch(url, { headers });

  if (response.status === 200) {
    const jsonData = await response.json();

    const insertQuery =
      "INSERT INTO boilerbites.dishes (id, dish_name, vegetarian, vegan, pork, beef, gluten, nuts, calories, carbs, protein, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = id";
      
    const data = [
      jsonData.ID,
      jsonData.Name,
      jsonData.IsVegetarian,
      jsonData.Allergens && jsonData.Allergens[11]
        ? jsonData.Allergens[11].Value
        : null,
      !jsonData.IsVegetarian &&
      jsonData.Nutrition &&
      jsonData.Nutrition.Ingredients
        ? await hasPig(jsonData)
        : null,
      !jsonData.IsVegetarian &&
      jsonData.Nutrition &&
      jsonData.Nutrition.Ingredients
        ? await hasCow(jsonData)
        : null,
      jsonData.Allergens && jsonData.Allergens[3]
        ? jsonData.Allergens[3].Value
        : null,
      jsonData.Allergens &&
        ((jsonData.Allergens[9] ? jsonData.Allergens[9].Value : null) ||
          (jsonData.Allergens[5] ? jsonData.Allergens[5].Value : null)),
      jsonData.Nutrition && jsonData.Nutrition[1]
        ? jsonData.Nutrition[1].Value
        : null,
      jsonData.Nutrition && jsonData.Nutrition[3]
        ? jsonData.Nutrition[3].Value
        : null,
      jsonData.Nutrition && jsonData.Nutrition[7]
        ? jsonData.Nutrition[7].Value
        : null,
      jsonData.Nutrition && jsonData.Nutrition[11]
        ? jsonData.Nutrition[11].Value
        : null,
    ];

    const connection = await pool.getConnection();

    try {
      // Check if the dish exists
      const existsQuery =
        "SELECT COUNT(*) AS count FROM boilerbites.dishes WHERE id = ?";
      const existsResults = await connection.query(existsQuery, [jsonData.ID]);
      const exists = existsResults[0].count > 0;

      if (!exists) {
        await connection.query(insertQuery, data);
        console.log(
          `Successfully inserted data for dish with ID ${jsonData.ID}`
        );
      } else {
        console.log(
          `Dish with ID ${jsonData.ID} already exists. Skipping insertion.`
        );
      }
    } catch (error) {
      console.error("Error checking or inserting data:", error);
    } finally {
      connection.release();
    }
  } else {
    console.log(
      `GET request failed for dish with ID ${id}. Status Code:`,
      response.status
    );
  }
}

async function processMeals(data, pool) {
  const dishPromises = [];
  for (const meal of data.Meals) {
    if (meal["Status"] == "Open") {
      for (const station of meal["Stations"]) {
        for (const item of station["Items"]) {
          const dishId = item.ID;
          try {
            const promise = addDishIfNotExists(dishId, pool);
            dishPromises.push(promise);
          } catch (error) {
            console.error("Error processing dish:", error);
          }
        }
      }
    }
  }
  await Promise.all(dishPromises);
}

async function getLocationData(req, res) {
  const { location, date } = req.params;
  const pool = req.app.locals.pool; // Use the pool from app.locals
  const restrictions = req.query.restrict?.split(",") || [];
  const url = `https://api.hfs.purdue.edu/menus/v2/locations/${location}/${date}`;

  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const jsonData = await response.json();
      processMeals(jsonData, pool);
      const dishes = await fetchRatingsForDishes(jsonData, restrictions, pool);
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

async function fetchRatingsForDishes(jsonData, restrictions, pool) {
  const connection = await pool.getConnection();
  const filters = {
    vegetarian: "vegetarian = true",
    vegan: "vegan = true",
    "no beef": "beef = false",
    "no pork": "pork = false",
    "gluten-free": "gluten = false",
  };
  const query = `
  SELECT d.id, d.dish_name, AVG(r.stars) AS average_stars, COUNT(r.stars) AS num_ratings
  FROM boilerbites.dishes AS d
  LEFT JOIN boilerbites.ratings AS r ON d.id = r.dish_id
  WHERE d.id IN (?)
  ${
    restrictions.length > 0
      ? "AND " + restrictions.map((r) => filters[r]).join(" AND ")
      : ""
  }
  GROUP BY d.id, d.dish_name;
  `;
  const dishIds = [];
  jsonData.Meals.forEach((meal) => {
    meal.Stations.forEach((station) => {
      station.Items.forEach((item) => {
        dishIds.push(item.ID);
      });
    });
  });
  let results = [];
  try {
    [results, _] = await connection.query(query, [dishIds]);
  } catch (err) {
    console.error("Error fetching rating:", err);
  }
  connection.release();
  return results;
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
        if (dish) {
          return {
            id: itemId,
            dish_name: dishName,
            avg: dish.average_stars,
            reviews: dish.num_ratings,
          };
        }
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
