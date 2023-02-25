"use strict";
import func from "joi/lib/types/func";
import { Op } from "sequelize";
import db from "../../../database";
import ApiError from "../../../helper/apiError";
const { user } = db;

const userServices = {
  checkUserEmailExists: async (email, mobile_no) => {
    const count = await user.count({
      where: {
        [Op.and]: [
          {
            email,
            mobile_no,
          },
        ],
      },
    });
    if (count) throw ApiError.badRequest("Email Id already Exists");
    return;
  },

  createUser: async (body) => {
    return await user.create(body);
  },

  logIn: async (email, password) => {
    const userFind = await user.findOne({
      where: { email, password },
      attributes: { exclude: ["password"] },
    });
    if (!userFind) {
      throw ApiError.unauthorized("Incorrect Login");
    }
    return userFind;
  },
  findUserByEmail: async (email) => {
    const userFind = await user.findOne({
      where: { email },
    });
    console.log(userFind);
    if (!userFind) throw ApiError.badRequest("Email Id Does Not Exists");
    return userFind;
  },

  findUserById: async (id) => {
    return await user.findOne({
      where: {
        id,
      },
    });
  },

  getUsers: async (filter, pageInfo) => {
    const conditionArr = [];
    const { search } = filter;
    if (search) {
      conditionArr.push({
        [Op.or]: [
          {
            first_name: db.sequelize.where(
              db.sequelize.fn("LOWER", db.sequelize.col("first_name")),
              "LIKE",
              "%" + search.toLowerCase() + "%"
            ),
          },
          {
            last_name: db.sequelize.where(
              db.sequelize.fn("LOWER", db.sequelize.col("last_name")),
              "LIKE",
              "%" + search.toLowerCase() + "%"
            ),
          },
          {
            mobile_no: db.sequelize.where(
              db.sequelize.fn("LOWER", db.sequelize.col("mobile_no")),
              "LIKE",
              "%" + search.toLowerCase() + "%"
            ),
          },
          {
            email: db.sequelize.where(
              db.sequelize.fn("LOWER", db.sequelize.col("email")),
              "LIKE",
              "%" + search.toLowerCase() + "%"
            ),
          },
        ],
      });
    }

    return user.findAll({
      where: {
        [Op.and]: conditionArr,
      },
      limit: pageInfo.limit,
      offset: pageInfo.skip,
      order: [["created_at", "DESC"]],
    });
  },

  updateUser: async (id, updateValue) => {
    const result = await user.update(updateValue, {
      where: { id },
      returning: true,
    });
    return result[1];
  },
};
module.exports = { userServices };
