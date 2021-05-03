require("dotenv").config();
const express = require("express");
var cors = require("cors");

// Import postgres db
const db = require("./db");

const app = express();

app.use(express.json());

// Enable Cross-Origin Requests
// remove before build, use c-r-a proxy
app.use(cors());

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    // const result = await db.query("select * from restaurants");
    const restaurantRatingsData = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id"
    );

    // console.log(result);
    console.log(restaurantRatingsData);

    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// Get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      [req.params.id]
    );

    const reviews = await db.query(
      "select * from reviews where restaurant_id = $1",
      [req.params.id]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  try {
    const { name, location, price_range } = req.body;

    const result = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [name, location, price_range]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: result,
      },
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, location, price_range } = req.body;
    const result = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [name, location, price_range, id]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: result.rows[0],
      },
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query("DELETE FROM restaurants where id = $1", [
      id,
    ]);

    res.status(200).send();
  } catch (err) {
    res.status(400).send(err);
  }
  console.log(req.params);
  res.status(200).json({
    status: "success",
    data: {
      restaurant: "mcdonalds",
    },
  });
});

// Add a review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, review, rating } = req.body;
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      [id, name, review, rating]
    );

    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
