const express = require("express");
const cors = require("cors");

const { userRouter } = require("./routes/user.routes");
const { connection } = require("./config/dbConnection");
const { apolloServer } = require("./graphql/server/apolloServer");
const app = express();

// ^ Mounting Apollo Server as middleware on your Express app
async function startApolloServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

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
    startApolloServer(); // function call to start apollo server
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }

  console.log(`Server is running at port ${process.env.PORT}`);
  console.log(`Apollo server is running at port http://localhost:8080/graphql`);
});
