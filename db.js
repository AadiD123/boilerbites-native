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
  
  async function iterateLocationsAndDays() {
    try {
      const connection = await mysql.createConnection(dbConfig);
      
      for (const location of locations) {
        let currentDate = new Date();
        for (let day = 0; day <= 7; day++) {
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
  
  iterateLocationsAndDays();