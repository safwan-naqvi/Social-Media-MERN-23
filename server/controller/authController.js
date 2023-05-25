const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const UserDTO = require("../DTO/user");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  async register(req, res, next) {
    //1. Validate User Input
    const userRegSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegSchema.validate(req.body);
    console.log(error);
    //2. If error in validation -> return error via middleware
    if (error) {
      return next(error);
    }
    //3. If email of username already exist -> return error
    const { username, name, email, password } = req.body;
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = { status: 409, message: "Email Already Exists" };
        return next(error);
      }

      if (usernameInUse) {
        const error = { status: 409, message: "Username Already Exists" };
        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    //4. password hash

    const hashedPass = await bcrypt.hash(password, 10);
    //5. store user data in db
    const userToRegister = new User({
      username,
      email,
      name,
      password: hashedPass,
    });

    const user = await userToRegister.save();
    //6. response send
    return res.status(201).json({ user });
  },

  async login(req, res, next) {
    //1. Validation user inputs
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });
    //2. if valid error then return using middleware

    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    //3. match username
    const { username, password } = req.body;
    let userExist;
    try {
      userExist = await User.findOne({ username: username });
      if (!userExist) {
        const error = {
          status: 401,
          message: "Invalid Username",
        };
        return next(error);
      }

      //match password
      const match = await bcrypt.compare(password, userExist.password);
      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
    } catch (error) {
      return;
    }

    const userDTO = new UserDTO(userExist);

    //4. return response
    return res.status(200).json({ user: userDTO });
  },
};

module.exports = authController;
