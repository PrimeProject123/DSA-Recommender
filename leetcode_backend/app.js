require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db.js");
const cookieParser = require("cookie-parser");
const problemRoutes = require("./src/api/problem.js");
const userRoutes = require("./src/api/user.js");
const allProblems = require("./src/api/fetchAll.js");
const analyticsRoutes = require("./src/api/analytics.js");
const authRoutes = require("./src/api/auth.js");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Validate environment variables
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error(
    "⚠️  ERROR: JWT_SECRET must be set and at least 32 characters!"
  );
  console.error("⚠️  Please update your .env file");
  process.exit(1);
}

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", problemRoutes);
app.use("/api", userRoutes);
app.use("/api", allProblems);
app.use("/api", analyticsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
  console.log(
    `🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
});
