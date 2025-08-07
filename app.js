const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const dbConfig = require("./services/config").dbConfig;
const seceretKey = require("./services/config").seceretKey;
const indexRouter = require("./routes").routes;
const path = require("path");
const logger = require("morgan");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();

//used for getting images for frontend
app.use("/uploads", express.static(path.join(__dirname, "routes", "uploads")));

//used to join frontend and backend
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  createParentPath:true
}));
//logger in console of terminal
app.use(logger("dev"));

//server running port
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server Running On:${PORT}`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//index router for whole routes of api
app.use("/",indexRouter);

//session and seceret key added
app.use(
    session({
        secret:seceretKey,
        resave:false,
        saveUninitialized:true
    })
)

//cookie parser
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb",extended: true }));

const mongoUri = `${dbConfig.host}`;

//connection to database
mongoose.connect(mongoUri);

mongoose.connection.once("open", () => {
  console.log(`Database Connected Successfully: ${dbConfig.dbName}`);
});

mongoose.connection.on("error", () => {
  throw new Error(`Error connecting to the database: ${err}`);
});

//catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
