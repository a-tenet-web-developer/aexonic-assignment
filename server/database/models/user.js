"use strict";
import role from "../../enums/role";

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      mobile_no: {
        type: DataTypes.STRING,
        unique: true,
      },
      address: DataTypes.STRING,
    },
    {
      uniqueKeys: {
        Items_unique: {
          fields: ["email"],
        },
      },
    }
  );
  return user;
};
