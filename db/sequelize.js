import { Sequelize } from "sequelize";

const { DB_USERNAME, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT } = process.env;

const sequelize = new Sequelize({
  dialect: "postgres",
  username: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_DATABASE,
  port: DB_PORT,
  dialectOptions: {
    ssl: true,
  },
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
  process.exit(1);
}

export default sequelize;
