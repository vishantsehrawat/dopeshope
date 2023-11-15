const { Sequelize } = require("sequelize");
require("dotenv").config();

try {
  const sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    username: "your_username",
    password: "your_password",
    database: "your_database_name",
  });

//   console.log("🚀 ~ file: postgresSequelize.js:12 ~ sequelize:", sequelize);

  module.exports = { sequelize };
} catch (error) {
  console.error("Error connecting to the database:", error);
}
