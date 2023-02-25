import userV1 from "./api/v1/controllers/user/routes";

export default function routes(app) {
  var unless = function (middleware, ...paths) {
    return function (req, res, next) {
      const pathCheck = paths.some((path) => path === req.path);
      pathCheck ? next() : middleware(req, res, next);
    };
  };

  app.use("/v1/user", userV1);

  return app;
}
