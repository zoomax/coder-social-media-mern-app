// imports
const express = require("express");
const mainRouteRouter = require("./routes/main-route");
const dotenv = require("dotenv");
const connectDB = require("./utils/connectDB");
const bodyParser = require("body-parser");
dotenv.config({
  path: "config/config.env",
});
connectDB();

// variables
const PORT = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));
app.use("/api", mainRouteRouter);

// running server
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
