import error from "./error";

class ApiError extends Error {
  constructor(code, message, data = {}) {
    super(message);
    this.code = code;
    this.message = message ? message : error[code] || "internal server error";
    this.isApiError = true;
    this.data = data;
    console.log(this.message);
  }

  static unauthorized(msg) {
    return new ApiError(401, msg);
  }
  static badRequest(msg) {
    return new ApiError(400, msg);
  }
  static internal(msg) {
    return new ApiError(500, msg);
  }
  static notFound(msg) {
    return new ApiError(404, msg);
  }
  static notAllowed(msg) {
    return new ApiError(405, msg);
  }
  static conflict(msg, metadata = {}) {
    return new ApiError(409, msg, metadata);
  }
  static notVerified(msg) {
    return new ApiError(520, msg);
  }
  static versionUpdate(msg, metadata = {}) {
    return new ApiError(426, msg, metadata);
  }
  static txnNotFound(msg) {
    return new ApiError(200, msg);
  }
}

module.exports = ApiError;
