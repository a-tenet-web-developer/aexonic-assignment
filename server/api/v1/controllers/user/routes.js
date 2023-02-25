import Express from "express";
import controller from "./controller";
import userAuthentication from "../../../../helper/auth";

export default Express.Router()
  .post("/signup", controller.signup)
  .post("/login", controller.login)

  .use(userAuthentication)
  .get("/get-profile", controller.getProfile)
  .get("/get-all-users", controller.getAllUsers)
  .patch("/update-profile", controller.updateProfile);
