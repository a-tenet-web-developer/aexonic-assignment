const dotenv = require("dotenv");
dotenv.config();
const env = process.env;
module.exports = {
  db_host: "localhost",
  db_user_name: "myuser",
  db_password: "mypassword",
  db_name: "mydb",
  db_dialect: env.DB_DIALECT,
  db_pool: {
    max: 5,
    min: 0,
    acquire: 0,
    idle: 0,
  },
  db_port: 5432,
};
