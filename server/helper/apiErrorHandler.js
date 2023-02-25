const apiErrorhandler = (err, req, res, next) => {
  console.log(err, "Error From Middleware.");
  if (err.isApiError) {
    res.status(err.code).json({
      code: err.code,
      message: err.message,
      data: err.data ? err.data : {},
    });
    return;
  }
  if (err.message == "Validation error") {
    res.status(502).json({
      code: 502,
      message: err.original.message,
    });
    return;
  }
  res.status(err.code && err.code < 500 ? err.code : 500).json({
    code: err.code && err.code < 500 ? err.code : 500,
    message: err.message.replace(/"/g, "'")
      ? err.message.replace(/"/g, "'")
      : err.message,
  });
  return;
};
module.exports = apiErrorhandler;
