const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
require("dotenv").config();

const indexRoute = require("./routes/index.route");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");

const app = express();
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));

const Port = process.env.PORT || 3000;

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/user", userRoute);

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render('error_40x',{error});
});

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("DB Connected");
    app.listen(Port, () => {
      console.log(` 🚀 is running on ${Port} `);
    });
  })
  .catch((err) => {
    console.log(err);
  });
