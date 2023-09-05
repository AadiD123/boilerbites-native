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

async function addDish(id, location, connection) {
  const url = "https://api.hfs.purdue.edu/menus/v2/items/" + id;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
  };

  const response = await fetch(url, { headers });

  if (response.status === 200) {
    const jsonData = await response.json();

    const insertQuery =
      "INSERT INTO boilerbites.dishes (id, dish_name, location, vegetarian, vegan, pork, beef, gluten, nuts, calories, carbs, protein, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const data = [
      jsonData.ID,
      jsonData.Name,
      location,
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

async function isDishExists(dishId, connection) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT COUNT(*) AS count FROM boilerbites.dishes WHERE id = ?";
    connection.query(query, [dishId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
}

async function processMeals(data, dbConnection) {
  for (const meal of data.Meals) {
    if (meal["Status"] == "Open") {
      for (const station of meal["Stations"]) {
        for (const item of station["Items"]) {
          const dishId = item.ID;
          try {
            const exists = await isDishExists(dishId, dbConnection);

            if (!exists) {
              console.log(
                `Dish with ID ${dishId} doesn't exist in the database. Adding...`
              );
              await addDish(dishId, data.Location, dbConnection);
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
  var restrictions = req.query.restrict;
  restrictions = restrictions.split(",");
  const filters = {
    vegetarian: "vegetarian = true",
    vegan: "vegan = true",
    "no beef": "beef = false",
    "no pork": "pork = false",
    "gluten-free": "gluten = false",
  };
  var query = "SELECT id FROM boilerbites.dishes WHERE ";
  for (var r in restrictions) {
    query += filters[restrictions[r]];
    if (parseInt(r) !== restrictions.length - 1) {
      query += " AND ";
    }
  }
  const db = req.db;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error querying dishes:", error);
    } else {
      var ids = [];
      for (var i in results) {
        ids.push(results[i].id);
      }
      console.log(ids);
    }});
  const url =
    "https://api.hfs.purdue.edu/menus/v2/locations/" + location + "/" + date;
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const jsonData = await response.json();
      processMeals(jsonData, db)
        .then(() => {
          console.log("Processing completed.");
        })
        .catch((error) => {
          console.error("Error processing meals:", error);
        });
      //const filteredDishes = await queryDishesWithRestrictions(filters, db);
      res.json(jsonData);
    } else {
      console.log("GET request failed. Status Code:", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

module.exports = {
  getLocationData,
};
