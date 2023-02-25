import Config from "config";
import crypto from "crypto";
import Path from "path";
import Joi from "joi";
import c from "config";
import Role from "../enums/role";
import bcrypt from "bcryptjs";
import ApiError from "../helper/apiError";
const encryption = Config.get("encryption");
const saltLength = 9;


const generateSalt = (len) => {
  const set =
    "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
  let salt = "";
  let p = 2;
  for (let i = 0; i < len; i += 1) {
    salt += set[p];
    p += 3;
  }
  return salt;
};

const getReferralCode = () => {
  var x = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 8; i++) {
    x += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return x;
};

const generateUniqueCode = () => {
  var x = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 15; i++) {
    x += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return x;
};

/**
 *
 *
 * @param {any} string
 * @returns
 */
const md5 = (string) => crypto.createHash("md5").update(string).digest("hex");

/**
 * @param  {} text
 */
const encryptPass = (text) => {
  const salt = generateSalt(saltLength);
  const hash = md5(text + salt);
  return salt + hash;
};

/**
 * To generate any random number
 */
const generateOtp = () => Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

const generate12DigitTxnId = () => {
  const digits = "0123456789";
  let txnId = "";
  for (let i = 0; i < 12; i++) {
    txnId += digits[Math.floor(Math.random() * 10)];
  }
  return txnId;
};

const getImageUrl = (files) => {
  let finalUrl = {};
  if (!files) {
    return finalUrl;
  }
  files.forEach((doc) => {
    if (finalUrl.hasOwnProperty(doc.fieldname)) {
      if (!Array.isArray(finalUrl[doc.fieldname])) {
        let temp = finalUrl[doc.fieldname];
        finalUrl[doc.fieldname] = [];
        finalUrl[doc.fieldname].unshift(temp);
      }
      finalUrl[doc.fieldname].unshift(
        `https://${Config.get("S3.BUCKET_NAME")}.s3.amazonaws.com/${
          doc.filename
        }`
      );
    } else {
      finalUrl[doc.fieldname] = `https://${Config.get(
        "S3.BUCKET_NAME"
      )}.s3.amazonaws.com/${doc.filename}`;
    }
  });
  return finalUrl;
};

const comparePassword = async (userPassword, inputPassword) => {
  console.log(userPassword);
  console.log(inputPassword);
  // const result = await bcrypt.compare(inputPassword, userPassword);
  if (userPassword === inputPassword) {
    return true;
  }
  // if(!result) throw ApiError.badRequest('Incorrect Password');
  return;
};

const sanitizeUserByRole = (userInfo, userRole, token) => {
  let userDetail = {};
  if (userInfo) {
    const {
      id,
      full_name,
      role,
      email,
      mobile,
      country_code,
      address,
      gender,
      profile_picture,
      location,
      is_blocked,
      device_id,
      os_version,
      is_signedup,
      flat_number,
      country,
      state,
      city,
      zip,
      is_customer_first_role,
      second_profile_updated,
    } = userInfo;
    if (userRole == Role.CUSTOMER) {
      userDetail = {
        id,
        full_name,
        role,
        email,
        mobile,
        country_code,
        address,
        gender,
        profile_picture,
        location,
        is_blocked,
        device_id,
        os_version,
        is_signedup,
        flat_number,
        country,
        state,
        city,
        zip,
        is_customer_first_role,
        second_profile_updated,
      };
    } else {
      const { login_attempt, createdAt, deletedAt, ...userObject } =
        userInfo.toJSON();
      userDetail = userObject;
    }
  }
  if (token) {
    userDetail["token"] = token;
  }
  if (userRole) {
    return userDetail;
  }
};

/**
 * utility function to make pagination object
 * if pageNo and pageSize is undifined return pageObject = { skip: -1, limit: -1 }
 * @param {object} query (express request query object)
 * @returns
 */

const makePageObject = (query) => {
  let pageObject = { skip: 0, limit: 10 };
  if (query.pageNo && query.pageSize) {
    const pageNo = parseInt(query.pageNo);
    const pageSize = parseInt(query.pageSize);
    if (isFinite(pageNo) && isFinite(pageSize)) {
      const skip = (pageNo - 1) * pageSize;
      const limit = pageSize;
      pageObject.skip = skip;
      pageObject.limit = limit;
      return pageObject;
    }
  }
  return pageObject;
};

const generatePassword = () => {
  let length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

const alignArr = (csvData) => {
  csvData.forEach(async (row) => {
    row.splice(2, 0, row[1].split(" ")[1] ? row[1].split(" ")[1] : "");
    if (row[2] == "") {
      row[2] = row[1].split("  ")[1] ? row[1].split("  ")[1] : "";
    }
    row[1] = row[1].split(" ")[0];
    row.splice(3, 0, null, "+1");
    row.splice(
      6,
      0,
      null,
      null,
      null,
      null,
      "Canada",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "verified",
      false,
      0
    );
    row.splice(
      23,
      0,
      `"customer"`,
      getReferralCode(),
      parseInt(row[0].split("C")[1]),
      new Date(),
      new Date()
    );
    row.splice(
      28,
      0,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
    row.splice(38, 0, false, false, false, false, false);
    row.splice(43, 0, true, true, true, true);
    row.splice(47, 0, null, true, true);

    row.splice(
      56,
      0,
      "verified",
      new Date(),
      new Date(),
      null,
      null,
      null,
      null,
      null,
      null,
      true
    );
    row.splice(66, 0, 0, new Date(), new Date(), null, true, true);
  });
  return csvData;
};

const alignArray = (csvData) => {
  csvData.forEach(async (row) => {
    // row.splice(2, 0, (row[1].split(' ')[1] ? row[1].split(' ')[1] : ''));
    // if (row[2] == "") {
    // 	row[2] = row[1].split('  ')[1] ? row[1].split('  ')[1] : '';
    // }
    // row[1] = row[1].split(' ')[0];
    row.splice(0, 0, null, null, null, null, `"customer"`);
    row.splice(6, 0, "+61", null, null, null, null);
    row.splice(
      12,
      0,
      getReferralCode(),
      null,
      true,
      true,
      false,
      false,
      false,
      true,
      true,
      null,
      null,
      "Australia",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "verified",
      null,
      null,
      null,
      false,
      null,
      null,
      false,
      false,
      null,
      0,
      parseInt(row[11].split("C")[1]),
      true,
      true,
      null,
      null,
      null,
      null,
      null,
      null,
      false,
      null,
      new Date(),
      new Date(),
      true
    );
    // row.splice(3, 0, null, '+44');
    // row.splice(6, 0, null, null, null, null, 'Australia', null, null, null, null, null, null, null, null, null, 'verified', false, 0);
    // row.splice(23, 0, `"customer"`, getReferralCode(), parseInt(row[0].split('C')[1]), new Date(), new Date());
    // row.splice(28, 0, null, null, null, null, null, null, null, null, null, null);
    // row.splice(38, 0, false, false, false, false, false);
    // row.splice(43, 0, true, true, true, true);
    // row.splice(47, 0, null, true, true);

    // row.splice(56, 0, 'verified', new Date(), new Date(), null, null, null, null, null, null, true);
    // row.splice(66, 0, 0, new Date(), new Date(), null, true, true);
  });
  return csvData;
};

const encode = (text) => Buffer.from(text).toString("base64");

const verifyingCredentials = async (userPassword, inputPassword) => {
  console.log("userPassword=>", userPassword);
  console.log("inputPassword=>", inputPassword);
  let isPasswordCorrect = await comparePassword(userPassword, inputPassword);
  if (!isPasswordCorrect) throw ApiError.badRequest("Incorrect Login");
  return;
};

module.exports = {
  generateOtp,
  getReferralCode,
  generateUniqueCode,
  encryptPass,
  getImageUrl,
  sanitizeUserByRole,
  makePageObject,
  alignArr,
  generate12DigitTxnId,
  generatePassword,
  encode,
  alignArray,
  verifyingCredentials,
  comparePassword,
};
