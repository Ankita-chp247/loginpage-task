"use strict";

const { UserModel } = require("../models")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require ("jsonwebtoken")
const { message } = require("../common/message");



/**
 * user login
 * Create a record
 * @param { req, res }
 * @returns JsonResponse
 */

const loginUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10);

    // save the data in database of user 
    await UserModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });
    return res.status(200).json(
        { message: message.USER_LOGIN }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,
    });
  }
};

/**
 * login a user and generate JWT token
 * @param { req, res }
 * @returns JsonResponse
 */


const userLoginAction = async (req, res) => {
  try {   
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    const isPasswordCheck = await bcrypt.compare(password, user.password);
    console.log(isPasswordCheck)

    if (!isPasswordCheck) {                            
        return res                        
            .status(422)               
            .json({                        
                errors: { message: message.PASSWORD_NOT_MATCH }                 
            });
    }

    // generate JWT token code

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
    res.redirect("/organizationList")
     
    // return res.status(200).json(
    //     { message: message.LOGIN_SUCCESS, 
    //       token: token 
    //     }
    // );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,
    });
  }


}
/**
 * Get only single record
 * @param { req, res }
 * @returns JsonResponse
 */
const userList = async (req, res, next) => {
  try {

    const user = await UserModel.find({ isDeleted: false })

    console.log(user)
    return res.status(200).json({
      message: message.USER_DATA_LIST,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,
    });
  }
}


/**
 * update a record
 * @param { req, res }
 * @returns JsonResponse
 */

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { body } = req
    const user = await UserModel.find({ _id: { $ne: id }, email: body.email, isDeleted: false }).select({ "password": 0 })
    if (user.length > 0) {
      return res.status(404).json({
        message: message.EMAIL_ALREADY_EXISTS,
      });
    }
    await UserModel.updateOne({ _id: id }, { $set: body })
    return res.status(200).json({
      success: true,
      message: message.USER_DATA_UPDATED,

    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,
    });

  }
};

/**
 * Destroy a record
 * @param { req, res }
 * @returns JsonResponse
 */
const deleteUser = async (req, res, next) => {
  try {
    //const deleteuser = await user.find()
    
    const user = await user.findByIdAndDelete(req.params.id);
                             
      res.status(200).json({
          success: true,
          message: message.USER_DATA_DELETED,
      });
  }catch(error){
      res.status(500).json({
        message: error.message ? error.message : message.ERROR_MESSAGE,

      });
  }
};



/**
 * Export as a single common js module
 */
module.exports = {
  loginUser,
  userLoginAction,
  userList,
  updateUser,
  deleteUser
};