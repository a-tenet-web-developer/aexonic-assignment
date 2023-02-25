import jwt from "jsonwebtoken";

module.exports.generateJWT = async (rawData) => {
  try {
    if (typeof rawData === "object" && !Array.isArray(rawData)) {
      const jwtData = {};
      jwtData.exp = Number(
        Math.floor(Date.now() / 1000) +
          60 * 60 * 60 * 60 * 60 * 60 * 60 * 60 * 60 * 2
      );
      jwtData.data = rawData;

      const token = await jwt.sign(jwtData, process.env.JWT_SECRET, {
        algorithm: process.env.JWT_ALGO,
      });
      return token;
    }
    throw new Error("Data not found");
  } catch (err) {
    return err;
  }
};

module.exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithm: process.env.JWT_ALGO,
      });
      resolve(decoded);
    } catch (err) {
      reject({ message: "Unauthorized access" });
    }
  });
};
