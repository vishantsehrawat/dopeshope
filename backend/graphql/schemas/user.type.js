const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String
    password: String
    gender: String
    location: String
    contact: String
    role: String
    isMailVerified: Boolean
    image: String
    s3Url: String
    # s3UrlExpireDate:
    isBlocked: Boolean
    # otp: OTP
    # wishlist: [Product]
  }

  input userInput {
    id: ID!
    name: String!
    email: String!
    password: String!
    gender: String
    location: String!
    contact: String!
    role: String
    isMailVerified: Boolean
    image: String
    s3Url: String
    # s3UrlExpireDate: Date
    isBlocked: Boolean
    # otp: OTP
  }

  type Query {
    getUserById(id: ID!): User
    # using square bracket bcz  it will return a list of allUsers
    getUser: [User]
    getUserByEmail(email: String!): User
  }

  type Mutation {
    # create user is the name of the mutation operation and in brackets we are passing an argument newUser which is of type "useInput"
    # in summary, the createUser mutation expects an input object (newuser) of type userInput. When executed, it creates a new user based on the provided input and returns a User object representing the created user. Clients can use this mutation to add new users to your system.
    createUser(newuser: userInput): User
    deleteUser(id: ID!): Boolean
    editUser(id: ID!, userInput: userInput): Boolean
  }
`;

module.exports = { typeDefs };
