const express = require("express");
const axios = require("axios");

const port = 5000;
const cors = require("cors");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth.routes");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

app.get("/api/weather", authMiddleware, async (req, res) => {
  try {
    const q = req.query.q;
    console.log("Query parameter:", q);

    const url = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
      params: {
        key: process.env.WEATHER_API_KEY,
        q,
      },
    });
    console.log("url", url);
    res.json(url.data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
