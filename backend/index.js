const express = require("express");
const cors = require("cors");

const { userRouter } = require("./routes/user.routes");
const { connection } = require("./config/dbConnection");
const app = express();

require("dotenv").config();
app.use(express.json());
// app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send({ msg: "home route" });
});

app.use("/user", userRouter);

app.listen(process.env.PORT, async (req, res) => {
  try {
    await connection;
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }

  console.log(`Server is running at port ${process.env.PORT}`);
});
