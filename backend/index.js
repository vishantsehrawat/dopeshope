const express = require("express");
const cors = require("cors");

const { ApolloServer, gql } = require("apollo-server-express");
const { userRouter } = require("./routes/user.routes");
const { connection } = require("./config/dbConnection");
const app = express();

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello: () => "Hello, GraphQL!",
  },
};
// ^ apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// ^ Mounting Apollo Server as middleware on your Express app
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
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
    startApolloServer();
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }

  console.log(`Server is running at port ${process.env.PORT}`);
  console.log(`Apollod server is running at port http://localhost:8080/graphql`);
});
