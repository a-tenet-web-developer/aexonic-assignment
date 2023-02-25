import Joi from "joi";
import Response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage";
import { userServices } from "../../services/user";
const {
  checkUserEmailExists,
  createUser,
  findUserById,
  getUsers,
  updateUser,
  findUserByEmail,
  logIn,
} = userServices;
import { comparePassword } from "../../../../helper/util";
import {
  encryptPass,
  makePageObject,
  getImageUrl,
} from "../../../../helper/util";
import { generateJWT } from "../../../../helper/jwt";
import ApiError from "../../../../helper/apiError";

export class UserController {
  async signup(request, response, next) {
    const validationSchema = {
      first_name: Joi.string().min(3).max(30).required().trim(),
      last_name: Joi.string().min(3).max(30).required().trim(),
      email: Joi.string().email().required().trim(),
      password: Joi.string().required(),
      repeat_password: Joi.ref("password"),
      mobile_no: Joi.string().required(),
      address: Joi.string().required().trim(),
    };
    try {
      let validatedBody = await Joi.validate(request.body, validationSchema);
      let { first_name, last_name, email, password, mobile_no, address } =
        validatedBody;
      await checkUserEmailExists(email, mobile_no);
      password = encryptPass(password);
      const result = await createUser({
        first_name,
        last_name,
        email,
        password,
        mobile_no,
        address,
      });
      return response.json(new Response(result, "User Signed Up"));
    } catch (error) {
      return next(error);
    }
  }

  async login(request, response, next) {
    const validateSchema = {
      email: Joi.string().email().required().trim(),
      password: Joi.string().optional(),
    };
    try {
      let { email, password } = await Joi.validate(
        request.body,
        validateSchema
      );
      console.log("Pahunch rha");
      let userFind = await findUserByEmail(email);
      userFind = await logIn(email, encryptPass(password));
      console.log(userFind);
      userFind = await generateJWT(userFind);

      const result = Object.assign({}, { userFind });
      return response.json(new Response(result, "Login Successful"));
    } catch (error) {
      return next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const { userId } = req.userInfo.data;
      const result = await findUserById(userId);
      return res.json(new Response(result, "User Details"));
    } catch (error) {
      return next(error);
    }
  }

  async getAllUsers(req, res, next) {
    const validationSchema = {
      pageNo: Joi.number().optional(),
      pageSize: Joi.number().optional(),
      search: Joi.string().optional().trim(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      const pageInfo = makePageObject(validatedBody);
      const result = await getUsers(validatedBody, pageInfo);
      return res.json(new Response({ result }, "Data Found"));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(request, response, next) {
    const validationSchema = {
      first_name: Joi.string().min(3).max(30).optional().trim(),
      last_name: Joi.string().min(3).max(30).optional().trim(),
      address: Joi.string().optional().trim(),
    };
    try {
      const { first_name, last_name, address } = await Joi.validate(
        request.body,
        validationSchema
      );
      const { userId } = request.userInfo.data;
      const result = await updateUser(userId, {
        first_name,
        last_name,
        address,
      });
      return response.json(new Response(result, "User Signed Up"));
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();
