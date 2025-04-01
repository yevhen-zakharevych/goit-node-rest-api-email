import { DataTypes } from "sequelize";

import sequelize from "../db/sequelize.js";

import { emailRegexp } from "../constants/emailRegexp.js";
import { subscriptionTypes } from "../constants/subscriptionTypes.js";

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: emailRegexp,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription: {
    type: DataTypes.ENUM,
    values: [...subscriptionTypes],
    defaultValue: "starter",
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatarURL: DataTypes.STRING,
});

// User.sync({ force: true });

export default User;
