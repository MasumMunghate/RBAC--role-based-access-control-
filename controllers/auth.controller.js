const db = require("../db/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
dotenv.config();

const generatetoken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const singup = catchAsync(async (req, res, next) => {
  try {
    const body = req.body;
    if (!["1", "2"].includes(body.userType)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user type",
      });
    }
    const newUser = await db.AuthUser.create({
      userType: body.userType,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });
    if (!newUser) {
      return next(new AppError("failed to create the user", 400));
    }
    const result = newUser.toJSON(); // convert the js object from model object not return json string it return js object

    delete result.password;
    // delete result.deletedAt;

    result.token = generatetoken({
      id: result.id,
    });

    if (!result) {
      return res.status(400).json({
        status: "fail",
        message: "User not create",
      });
    }
    return res.status(200).json({
      status: "succues",
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

const login = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const result = await db.AuthUser.findOne({ where: { email } });
    if (!result || !(await bcrypt.compare(password, result.password))) {
      return next(new AppError("Incorrect Email or Password", 401));
    }
    const token = generatetoken({
      id: result.id,
    });
    return res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    throw error;
  }
});

const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";
  if (req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')) {
    idToken = req.headers.authorization.split(' ')[1];
  }
  console.log(idToken,"isToken");
  if (!idToken) {
    return next(new AppError("Please login to get access",401));
  }
  
  const tokenDetails = jwt.verify(idToken, process.env.SECRET_KEY)
  console.log(tokenDetails,"tokenDetails");
  
  const freshUser = await db.AuthUser.findByPk(tokenDetails.id);
  console.log(freshUser,"FreshUser");
  
  if(!freshUser){
    return next(new AppError('User no longer Exist', 400))
  }
  req.authuser = freshUser;
  return next();
});

const restriTo = (userType)=>{
    const cheackPermition = (req, res, next)=>{
      if(!userType.includes(req.authuser.userType)){
        return next(new AppError('You dont have permission to perform this'))
      }
      return next()
    }
    return cheackPermition
}
module.exports = { singup, login, authentication,restriTo };

//authentication in 3 step
/**
 * 1)get the tocken from header
 * 2)token verification
 * 3)get the user details from db and add the req object
 */
