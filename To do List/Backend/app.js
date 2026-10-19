
const express = require("express");
const cors = require("cors");

const tasckRouter = require("./routes/tascksRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api", tasckRouter);

app.get("/", (req, res) => {
  res.json({ message: "done" });
});

// Error Handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    error: err.message || "Server Error",
  });
});

module.exports = app;
