const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const logger = require("morgan");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();

// Middleware setup
app.use(logger("dev"));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY || "default-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }
  })
);
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Database connection
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1/furntech";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: "majority"
})
  .then(() => console.log("Database Connected Successfully"))
  .catch(err => console.error("Database Connection Error:", err));

// Routes
const indexRouter = require("./routes").routes;
app.use("/.netlify/functions/api", indexRouter);
app.use("/api", indexRouter); // For local development

// Error handlers
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500
    }
  });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8001;
  app.listen(PORT, () => {
    console.log(`Server Running On: ${PORT}`);
  });
}

module.exports = app;
module.exports.handler = serverless(app);