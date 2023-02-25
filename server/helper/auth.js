"use strict";

import { verifyToken } from "./jwt";
import ApiError from "./apiError";
import { userServices } from "../api/v1/services/user";
const { findUserById } = userServices;
import responseMessage from "../../assets/responseMessage";

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers["authorization"];
    if (!auth || (auth && auth.indexOf("Bearer") === -1)) {
      throw ApiError.unauthorized();
    }
    const userData = await verifyToken(
      req.headers["authorization"].replace("Bearer", "").trim()
    );
    req.userInfo = userData;
    console.log("userData=>", userData);
    req.userInfo.data.userId = userData.data.id;
    console.log("UserId=>", req.userInfo.data.userId);
    req.userInfo.data.userRole = userData.data.role;
    var token = req.headers["authorization"].replace("Bearer", "").trim();
    var result = await findUserById(req.userInfo.data.userId);
    console.log("result=>", result);
    if (!result) {
      throw ApiError.unauthorized("User Not Found");
    }
    next();
  } catch (err) {
    next(err);
  }
};
