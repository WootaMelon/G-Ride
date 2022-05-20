const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 8080;
const { errorHandler } = require("./middleware/errorMiddleware");
const app = express();
const colors = require("colors");
const { connectDB } = require("./config/db");
const { sendfile } = require("express/lib/response");

//making the server use the routes created for group rides and users

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/groupRides", require("./routes/groupRideRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Sever started at port ${port}`));
