const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
require("dotenv").config();

const app = express();
app.use(morgan("dev"));

const Port = process.env.PORT || 3000;

app.get("/", (req, res, next) => {
  res.send("WORKING");
});

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.send(error);
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
