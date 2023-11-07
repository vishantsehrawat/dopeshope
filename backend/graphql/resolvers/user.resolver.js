const { UserModel } = require("../../models/user.model.js");

const resolvers = {
  Query: {
    async getUserById(_, { id }) {
      // "_" represents parent object and next parameter is the object that contains the arguments we passed
      const foundUser = await UserModel.findById(id);
      return foundUser;
    },
    async getUser() {
      const allUsers = await UserModel.find();
      if (!allUsers || allUsers.length === 0) {
        // Handle the case where no users are found
        throw new Error("No users found.");
      }
      return allUsers;
    },
    async getUserByEmail(_, { email }) {
      const user = await UserModel.findOne({ email });
      return user;
    },
  },
  Mutation: {
    async createUser(_, { userInput }) {
      // Use userInput instead of newuser
      const createdUser = new UserModel(userInput); // Use userInput instead of newuser
      const res = await createdUser.save();
      return {
        id: res.id,
        ...res._doc,
      };
    },
  },
};

module.exports = { resolvers };
