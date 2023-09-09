const getRatings = async (req, res) => {
  const db = req.app.locals.db;
  const { dish_id } = req.params;
  query = "SELECT AVG(stars) AS average_stars, COUNT(*) AS num_rows FROM boilerbites.ratings WHERE dish_id = ?";
  db.query(query, [dish_id], (error, results) => {
    if (error) {
      console.error("Error querying ratings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.length > 0 && results[0].average_stars !== null) {
        const averageStars = results[0].average_stars;
        const numRows = results[0].num_rows;
        res.status(200).json({ average_stars: averageStars, num_rows: numRows });
      } else {
        res.status(404).json({ error: "No ratings found for this dish" });
      }
    }
  });
};


// create a review
const createRating = async (req, res) => {
  const db = req.app.locals.db;
  const { stars, dish_id } = req.body;
  console.log(stars, dish_id);
  const insertQuery = "INSERT INTO boilerbites.ratings (stars, dish_id) VALUES (?, ?)";
  db.query(insertQuery, [stars, dish_id], (error, results) => {
    if (error) {
      console.error("Error inserting rating:", error);
    } else {
      res.status(200).json(results);
    }
  });
};

// update
const updateRating = async (req, res) => {
  const db = req.app.locals.db;
  const { rating_id } = req.params;
  const { stars } = req.body;
  const updateQuery = `UPDATE boilerbites.ratings SET stars = ? WHERE id = ?`;

  db.query(updateQuery, [stars, rating_id], (error, results) => {
    if (error) {
      console.error("Error updating rating:", error);
      res.status(500).json({ error: "Error updating rating" });
    } else {
      // Check if a rating was updated
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "Rating updated successfully" });
      } else {
        res.status(404).json({ error: "Rating not found" });
      }
    }
  });
};




module.exports = {
  createRating,
  getRatings,
  updateRating
};
