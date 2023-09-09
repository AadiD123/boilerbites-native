const fetch = require("node-fetch");

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
  const db = req.db;
  const restrictions = req.query.restrict?.split(",") || [];
  const url = `https://api.hfs.purdue.edu/menus/v2/locations/${location}/${date}`;
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const jsonData = await response.json();
      const dishData = jsonData.Meals.map((meal) => {
        const mealName = meal.Name;
        const status = meal.Status;
        const timing =
          status === "Open"
            ? [meal.Hours.StartTime, meal.Hours.EndTime]
            : ["Closed", "Closed"];
        const stations = meal.Stations.map((station) => {
          const stationName = station.Name;
          const items = station.Items.map((item) => {
            const itemId = item.ID;
            const dishName = item.Name;

            return { id: itemId, dish_name: dishName };
          });

          return { station_name: stationName, items };
        });

        return {
          meal_name: mealName,
          status: status,
          timing: timing,
          stations,
        };
      });

      const dishIds = [];
      jsonData.Meals.forEach((meal) => {
        meal.Stations.forEach((station) => {
          station.Items.forEach((item) => {
            dishIds.push(item.ID);
          });
        });
      });
      var query = `SELECT id, dish_name FROM boilerbites.dishes WHERE id IN (${dishIds
        .map((id) => `'${id}'`)
        .join(",")})`;

      if (restrictions.length > 0 && restrictions[0] !== "") {
        query += " AND ";
        for (var r in restrictions) {
          query += filters[restrictions[r]];
          if (parseInt(r) !== restrictions.length - 1) {
            query += " AND ";
          }
        }
      }
      var sum = 0;
      var num_dishes = 0;
      db.query(query, async (error, filtered) => {
        if (error) {
          console.error("Error querying dishes:", error);
        } else {
          for (const f of filtered) {
            query = "SELECT AVG(stars) AS average_stars FROM boilerbites.ratings WHERE dish_id = ?";
            db.query(query, [f], (error, results) => {
              if (error) {
                console.error("Error querying ratings:", error);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                if (results.length > 0 && results[0].average_stars !== null) {
                  sum += results[0].average_stars;
                  num_dishes++;
                } else {
                  res.status(404).json({ error: "No ratings found for this dish" });
                }
              }
            });
          }
        }
      });
      const averageStars = sum / num_dishes;
      res.status(200).json()
    } else {
      console.log("GET request failed. Status Code:", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

module.exports = {
  getDiningCourtRating,
  getDiningTiming
};