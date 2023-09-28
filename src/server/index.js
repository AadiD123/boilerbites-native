require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const getRatings = async (req, res) => {
    const pool = req.app.locals.pool;
  
    const connection = await pool.getConnection();
    try {
      const { dish_id } = req.params;
      const query =
        "SELECT AVG(stars) AS average_stars, COUNT(*) AS num_rows FROM boilerbites.ratings WHERE dish_id = ?";
      const results = await connection.query(query, [dish_id]);
  
      if (results.length > 0 && results[0].average_stars !== null) {
        const averageStars = results[0].average_stars;
        const numRows = results[0].num_rows;
        res.status(200).json({ average_stars: averageStars, num_rows: numRows });
      } else {
        res.status(404).json({ error: "No ratings found for this dish" });
      }
    } catch (error) {
      console.error("Error querying ratings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      connection.release();
    }
  };
  
  // create a review
  const createRating = async (req, res) => {
    const pool = req.app.locals.pool;
    const { dish_id, stars } = req.body;
  
    const connection = await pool.getConnection();
    try {
      const insertQuery =
        "INSERT INTO boilerbites.ratings (dish_id, stars) VALUES (?, ?)";
      const results = await connection.query(insertQuery, [dish_id, stars]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error inserting rating:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      connection.release();
    }
  };
  
  // update
  const updateRating = async (req, res) => {
    const pool = req.app.locals.pool;
    let { rating_id } = req.params;
    const { stars } = req.body;
  
    // Validate that rating_id is an integer
    rating_id = parseInt(rating_id);
    if (isNaN(rating_id)) {
      return res.status(400).json({ error: "Rating ID must be an integer" });
    }
  
    const updateQuery = `UPDATE boilerbites.ratings SET stars = ? WHERE id = ?`;
  
    const connection = await pool.getConnection();
    try {
      const results = await connection.query(updateQuery, [stars, rating_id]);
      console.log(results);
      if (results[0].affectedRows > 0) {
        res.status(200).json({ message: "Rating updated successfully" });
      } else {
        res.status(404).json({ error: "Rating not found" });
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      connection.release();
    }
  };
  
  const deleteRating = async (req, res) => {
    const pool = req.app.locals.pool;
    let { rating_id } = req.params;
  
    // Validate that rating_id is an integer
    rating_id = parseInt(rating_id);
    if (isNaN(rating_id)) {
      return res.status(400).json({ error: "Rating ID must be an integer" });
    }
  
    const deleteQuery = `DELETE FROM boilerbites.ratings WHERE id = ?`;
  
    const connection = await pool.getConnection();
    try {
      const results = await connection.query(deleteQuery, [rating_id]);
      console.log(results);
      if (results[0].affectedRows > 0) {
        res.status(200).json({ message: "Rating deleted successfully" });
      } else {
        res.status(404).json({ error: "Rating not found" });
      }
    } catch (error) {
      console.error("Error deleting rating:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      connection.release();
    }
  };

  function hasPig(item) {
    const pigKeywords = ["pork", "bacon", "ham", "sausage", "lard"];
    for (const keyword of pigKeywords) {
      if (item["Name"].toLowerCase().includes(keyword)) {
        return true;
      }
      if (item.Ingredients && item.Ingredients.toLowerCase().includes(keyword)) {
        return true;
      }
    }
    return false;
  }
  
  function hasCow(item) {
    const cowKeywords = ["beef", "steak", "veal", "brisket", "ribeye"];
    for (const keyword of cowKeywords) {
      if (item["Name"].toLowerCase().includes(keyword)) {
        return true;
      }
      if (item.Ingredients && item.Ingredients.toLowerCase().includes(keyword)) {
        return true;
      }
    }
    return false;
  }
  
  async function addDish(id, pool) {
    const url = "https://api.hfs.purdue.edu/menus/v2/items/" + id;
  
    const response = await fetch(url);
    if (response.status === 200) {
      const jsonData = await response.json();
  
      let pork = null;
      if (jsonData.IsVegetarian) {
        pork = false;
      } else {
        pork = hasPig(jsonData);
      }
  
      let beef = null;
      if (jsonData.IsVegetarian) {
        beef = false;
      } else {
        beef = hasCow(jsonData);
      }
  
      const insertQuery =
        "INSERT INTO boilerbites.dishes (id, dish_name, vegetarian, vegan, pork, beef, gluten, nuts, calories, carbs, protein, fat) VALUES ?";
      
      const data = [
        [
          jsonData.ID,
          jsonData.Name,
          jsonData.IsVegetarian,
          jsonData.Allergens && jsonData.Allergens[11]
            ? jsonData.Allergens[11].Value
            : null,
          pork,
          beef,
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
        ],
        
      ];
  
      const connection = await pool.getConnection();
      try {
        await connection.query(insertQuery, [data]); 
      } catch (error) {
        console.error("Error inserting data:", error);
      } finally {
        connection.release();
      }
    } else {
      console.log("GET request failed. Status Code:", response.status);
    }
  }
  
  async function isDishExists(dishId, pool) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM boilerbites.dishes WHERE id = ?",
        [dishId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      connection.release();
    }
    return false;
  }
  
  async function processMeals(data, pool) {
    for (const meal of data.Meals) {
      if (meal["Status"] == "Open") {
        for (const station of meal["Stations"]) {
          for (const item of station["Items"]) {
            const dishId = item.ID;
            try {
              const exists = await isDishExists(dishId, pool);
  
              if (!exists) {
                console.log(
                  `Dish with ID ${dishId} doesn't exist in the database. Adding...`
                );
                await addDish(dishId, pool);
                console.log(`Dish with ID ${dishId} added to the database.`);
              }
            } catch (error) {
              console.error("Error processing dish:", error);
            }
          }
        }
      }
    }
  }
  
  async function getLocationData(req, res) {
    const { location, date } = req.params;
    const pool = req.app.locals.pool; // Use the pool from app.locals
    const restrictions = req.query.restrict?.split(",") || [];
    const url = `https://api.hfs.purdue.edu/menus/v2/locations/${location}/${date}`;
  
    try {
      const [rows] = await pool.query(
        "SELECT * FROM boilerbites.timings WHERE location = ? AND date = ?",
        [location, date]
      );
      if (rows.length > 0) {
        const jsonData = rows[0].data;
        if (jsonData["IsPublished"] === false) {
          res.status(404).send("Not Published");
        }
        const connection = await pool.getConnection();
        try {
          const [rows] = await connection.query(
            "SELECT * FROM boilerbites.timings WHERE location = ? AND date = ?",
            [location, date]
          );
          if (rows.length === 0) {
            await processMeals(jsonData, pool);
            await connection.query(
              "INSERT INTO boilerbites.timings (location, date) VALUES (?, ?)",
              [location, date]
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          connection.release();
        }
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
      "no nuts": "nuts = false",
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
    } finally {
      connection.release();
    }
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
        }).filter(Boolean);
  
        return { station_name: stationName, items };
      });
      return {
        meal_name: mealName,
        stations,
      };
    });
  }
  
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
  
const app = express();

const pool = mysql.createPool({
  host: "boilerbites-1.cjmepwltgjhe.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "purduepete",
  connectionLimit: 10,
});

pool.on("acquire", (connection) => {
  console.log("Connection %d acquired", connection.threadId);
});

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.get("api/ratings/:dish_id", getRatings);

    // POST a review
app.post("api/ratings/", createRating);

    // UPDATE a review
app.patch("api/ratings/patch/:rating_id", updateRating);

app.delete("api/ratings/del/:rating_id", deleteRating);
app.get("/api/dinings/rating/:location/:date", getDiningCourtRating);
app.get("/api/dinings/timing/:location/:date", getDiningTiming);
app.get("/api/dishes/:location/:date", getLocationData);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Attach the pool to the app.locals so that you can access it in your routes
app.locals.pool = pool;
