const { body } = require("express-validator");
const { UserModel } = require("../models");

const SignupValidations = [
  body("firstName").not().isEmpty().withMessage("First name is required"),
  body("lastName").not().isEmpty().withMessage("Last name is required"),           
  body("email")
    .not()
    .isEmpty()                                                     
    .withMessage("Email is required")                                                      
    .isEmail()                                      
    .withMessage("Email is invalid")                                                                                                      
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value });                  
      if (user) {
        throw new Error("Email is alredy registred !");
      }
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isStrongPassword()
    .withMessage("Please select a stronger password"),

    body("userRole").not().isEmpty().withMessage("Please enter user role.").trim()
];

module.exports = {
  SignupValidations,
};