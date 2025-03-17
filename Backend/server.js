const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// dotenv.config();
// connectDB();
mongoose.connect("mongodb://localhost:27017/todo").then(()=>{
    console.log("connected");
})

// .catch(err)("Error")
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/todos", require("./routes/todoRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
