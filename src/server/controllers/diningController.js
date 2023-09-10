const fetch = require("node-fetch");
const mysql = require("mysql2/promise");
const { Pool } = require("@mui/icons-material");

async function getDiningTiming(req, res) {
  const { location, date } = req.params;
  const url = `https://api.hfs.purdue.edu/menus/v2/locations/${location}/${date}`;

  try {
    const response = await fetch(url);

    if (response.status === 200) {
      const jsonData = await response.json();

      const mealData = jsonData.Meals.map((meal) => {
        const mealName = meal.Name;
        const status = meal.Status;
        const timing =
          status === "Open"
            ? [meal.Hours.StartTime, meal.Hours.EndTime]
            : ["Closed", "Closed"];

        return {
          meal_name: mealName,
          status: status,
          timing: timing,
        };
      });

      res.status(200).json(mealData);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getDiningCourtRating(req, res) {
  const { location, date } = req.params;
  const filters = {
    vegetarian: "vegetarian = true",
    vegan: "vegan = true",
    "no beef": "beef = false",
    "no pork": "pork = false",
    "gluten-free": "gluten = false",
  };
  const pool = req.app.locals.pool;
  const restrictions = req.query.restrict?.split(",") || [];
  const url = `https://api.hfs.purdue.edu/menus/v2/locations/${location}/${date}`;

  try {
    const response = await fetch(url);

    if (response.status === 200) {
      const jsonData = await response.json();

      const dishIds = [];
      jsonData.Meals.forEach((meal) => {
        meal.Stations.forEach((station) => {
          station.Items.forEach((item) => {
            dishIds.push(item.ID);
          });
        });
      });

      if (dishIds.length === 0) {
        // Handle the case where no dishes were found
        return res.status(404).json({ error: "No dishes found" });
      }

      const query = `
  SELECT d.id, d.dish_name, AVG(r.stars) AS average_stars
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

      // Acquire a connection from the pool
      const connection = await pool.getConnection();

      try {
        const [filtered, _] = await connection.query(query, [dishIds]);
        const filteredDishes = filtered.filter(dish => dish.average_stars !== null);

        if (filteredDishes.length === 0) {
          return res
            .status(404)
            .json({ error: "No ratings found for any dish" });
        }

        console.log(filteredDishes);

        const sum = filteredDishes.reduce((acc, dish) => acc + dish.average_stars, 0);
        const num_dishes = filteredDishes.length;
        const averageStars = sum / num_dishes;

        res.status(200).json({ averageStars });
      } finally {
        // Always release the connection when done
        connection.release();
      }
    } else {
      console.log("GET request failed. Status Code:", response.status);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getDiningCourtRating,
  getDiningTiming,
};
