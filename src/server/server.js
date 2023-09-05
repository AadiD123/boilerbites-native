require("dotenv").config();

const express = require("express");
const mysql = require("mysql2")
const cors = require("cors");
const ratingRoutes = require("./routes/ratings");
const dishRoutes = require("./routes/dishes");
const timingRoutes = require("./routes/timings");


// creates express app
const app = express();
const db = mysql.createConnection({
  host: "boilerbites-1.cjmepwltgjhe.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "purduepete"
});

// attaches request body to request handler
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/ratings", ratingRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/timings", timingRoutes);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.locals.db = db;