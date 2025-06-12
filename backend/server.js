const express = require("express");
const mongoose = require("mongoose");
const app = express();
const mainRoute = require("./routes/index.js");
const port = 5000;
const cors = require("cors");
const logger = require("morgan");

// const dotenv = require("dotenv");
// dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://aisankheiri20:HJt1kUombwKhceen@dataplatform3.hkwdqcq.mongodb.net/?retryWrites=true&w=majority&appName=DataPlatform3/Data-Platform-3");
    console.log("Connected to mongoDb");
  } catch (error) {
    throw error;
  }
};

// middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(cors());

app.use("/api", mainRoute);

app.listen(port, () => {
  connect();
  console.log(`sunucu ${port} portunda cslisiyor`);
});
