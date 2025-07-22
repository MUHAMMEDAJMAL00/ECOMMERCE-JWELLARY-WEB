// routes/location.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon,
          format: "json",
        },
        headers: {
          "User-Agent": "myapp (myemail@example.com)", // Use real info to comply with their policy
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Reverse geocode error:", error.message);
    res.status(500).json({ error: "Failed to fetch location data" });
  }
});

module.exports = router;
