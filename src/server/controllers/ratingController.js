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
  const { rating_id } = req.params;
  const { stars } = req.body;
  const updateQuery = `UPDATE boilerbites.ratings SET stars = ? WHERE id = ?`;

  const connection = await pool.getConnection();
  try {
    const results = await connection.query(updateQuery, [stars, rating_id]);

    if (results.affectedRows > 0) {
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

module.exports = {
  createRating,
  getRatings,
  updateRating,
};
