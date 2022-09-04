const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use("/api/events", eventRoutes);
app.use("/api/users",userRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port: ${port}`));