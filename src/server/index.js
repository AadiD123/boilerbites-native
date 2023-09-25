require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const serverless = require("serverless-http");
const cors = require("cors");

const ratingRoutes = require("./routes/ratings");
const dishRoutes = require("./routes/dishes");
const diningRoutes = require("./routes/dinings");

const PORT = 4000;

const app = express();

const pool = mysql.createPool({
  host: "boilerbites-1.cjmepwltgjhe.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "purduepete",
  connectionLimit: 10,
});

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Crondon123",
//   connectionLimit: 10,
// });

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
app.use("/api/ratings", ratingRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/dinings", diningRoutes);

// No need to explicitly connect to the database here

if (process.env.ENVIRONMENT === "lambda") {
  module.exports.handler = serverless(app);
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
// Attach the pool to the app.locals so that you can access it in your routes
app.locals.pool = pool;
