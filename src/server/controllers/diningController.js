async function getDiningTiming(req, res) {
  const { location, date } = req.params;
  const pool = req.app.locals.pool;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM boilerbites.timings WHERE location = ? AND date = ?",
      [location, date]
    );
    if (rows.length > 0) {
      const jsonData = rows[0].data;
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
  } finally {
    connection.release();
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
    "no nuts": "nuts = false",
  };
  const pool = req.app.locals.pool;
  const restrictions = req.query.restrict?.split(",") || [];

  try {
    const [rows] = await pool.query(
      "SELECT * FROM boilerbites.timings WHERE location = ? AND date = ?",
      [location, date]
    );
    if (rows.length > 0) {
      const jsonData = rows[0].data;

      const dishIds = [];
      jsonData.Meals.forEach((meal) => {
        meal.Stations.forEach((station) => {
          station.Items.forEach((item) => {
            dishIds.push(item.ID);
          });
        });
      });

      if (dishIds.length === 0) {
        return res.status(404).json({ error: "No dishes found" });
      }
      let query = `
        SELECT d.id, d.dish_name, AVG(r.stars) AS average_stars
        FROM boilerbites.dishes AS d
        LEFT JOIN boilerbites.ratings AS r ON d.id = r.dish_id
        WHERE d.id IN (?)`;

      if (restrictions.length > 0) {
        query += " AND " + restrictions.map((r) => filters[r]).join(" AND ");
      }

      query += `
        GROUP BY d.id, d.dish_name;
      `;
      const connection = await pool.getConnection();

      try {
        const [filtered, _] = await connection.query(query, [dishIds]);
        const filteredDishes = filtered.filter(
          (dish) => dish.average_stars !== null
        );
        if (filteredDishes.length === 0) {
          return res
            .status(404)
            .json({ error: "No ratings found for any dish" });
        }

        const sum = filteredDishes.reduce(
          (acc, dish) => acc + parseFloat(dish.average_stars),
          0
        );
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
