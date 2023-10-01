const mysql = require("mysql2/promise");
const fetch = require("node-fetch");

const locations = ["Earhart", "Ford", "Wiley", "Windsor", "Hillenbrand",
    "1Bowl",
    "Pete's Za",
    "The Burrow",
    "The Gathering Place",
  ];

  const dbConfig = {
    host: "boilerbites-1.cjmepwltgjhe.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "purduepete"
  };

  const getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    return `${year}-${month}-${day}`;
  }

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
  
  async function addDish(id, connection) {
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
        "INSERT INTO boilerbites.dishes (id, dish_name, vegetarian, vegan, pork, beef, gluten, nuts, calories, fat, carbs, protein) VALUES ?";
      
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
      try {
        await connection.query(insertQuery, [data]); 
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    } else {
      console.log("GET request failed. Status Code:", response.status);
    }
  }
  
  async function isDishExists(dishId, connection) {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM boilerbites.dishes WHERE id = ?",
        [dishId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return false;
  }
  
  async function processMeals(data, connection) {
    for (const meal of data.Meals) {
      if (meal["Status"] == "Open") {
        for (const station of meal["Stations"]) {
          for (const item of station["Items"]) {
            const dishId = item.ID;
            try {
              const exists = await isDishExists(dishId, connection);
  
              if (!exists) {
                console.log(
                  `Dish with ID ${dishId} doesn't exist in the database. Adding...`
                );
                await addDish(dishId, connection);
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
    
  
  async function iterateLocationsAndDays() {
    try {
      const connection = await mysql.createConnection(dbConfig);
      
      for (const location of locations) {
        let currentDate = new Date();
        for (let day = -7; day <= 7; day++) {
          const formattedDate = formatDate(currentDate); // Format currentDate as needed
          
          // Check if a record with the same location and date already exists
          const selectQuery = "SELECT COUNT(*) AS count FROM boilerbites.timings WHERE location = ? AND date = ?";
          const [rows] = await connection.query(selectQuery, [location, formattedDate]);
  
          if (rows[0].count === 0) {
            // No existing record found, proceed with insertion
            const url = `https://api.hfs.purdue.edu/menus/v2/locations/${location}/${formattedDate}`;
            try {
              const response = await fetch(url);
              if (response.status === 200) {
                const jsonData = await response.json();
                if (jsonData["IsPublished"] === false) {
                  console.log("Not Published");
                } else {
                  const insertQuery = "INSERT INTO boilerbites.timings (location, date, data) VALUES (?, ?, ?)";
                  const results = await connection.query(insertQuery, [location, formattedDate, JSON.stringify(jsonData)]);
                  processMeals(jsonData, connection);
                  console.log(`Processing ${location} on Day ${formattedDate}`);
                }
              } else {
                console.log("GET request failed. Status Code:", response.status);
              }
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          } else {
            console.log(`Record for ${location} on Day ${formattedDate} already exists. Skipping insertion.`);
          }
  
          // Increment currentDate by one day
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      connection.end();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function fetchDataAndInsert() {
    try {
      const connection = await mysql.createConnection(dbConfig);
  
      const idQuery = 'SELECT id FROM boilerbites.dishes';
      const [rows] = await connection.query(idQuery);
      for (const row of rows) {
        const id = row.id;
        const url = `https://api.hfs.purdue.edu/menus/v2/items/${id}`;
  
        // Use node-fetch to make the HTTP request
        const response = await fetch(url);
        const data = await response.json(); // Assuming the response is JSON
        const updateQuery = 'UPDATE boilerbites.dishes SET fat = ?, carbs = ?, protein = ? WHERE id = ?';
        console.log(url, data, id);
        if (data["Nutrition"] && data["Nutrition"][0]) {
          await connection.query(updateQuery, [data["Nutrition"][3]["Value"], data["Nutrition"][7]["Value"], data["Nutrition"][11]["Value"], id]);
        }
  
        console.log(`Data for ID ${id} inserted into the database.`);
      }
  
      console.log('All data fetched and inserted successfully.');
  
    } catch (error) {
      console.error('Error:', error);
    } finally {
      db.end();
    }
  }
fetchDataAndInsert();
// try {
//   const connection = await mysql.createConnection(dbConfig);
  
// } catch (error) {
//   console.error("Error:", error);
// }