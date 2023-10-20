const express = require("express");
const cors = require("cors");
const { connection } = require("mongoose");


const app = express();

require("dotenv").config();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT, async (req, res) => {
  try {
    await connection;

    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }

  console.log(`Server is running at port ${process.env.PORT}`);
});
