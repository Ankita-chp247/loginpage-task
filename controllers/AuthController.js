"use strict";
const { UserModel } = require("../models")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { message } = require("../common/message");



/**
 * admin registraion 
 * Get all record
 * @param { req, res }
 * @returns JsonResponse
 */

const adminCreate = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password
    });
    console.log(user)
    return res.status(200).json({
      success: true,
      message: message.USER_LOGIN,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,

    });
  }
};

/** 
 * login a admin and generate JWT token 
 * @param { req, res }
 * @returns JsonResponse
 */

const adminLogin = async (req, res) => {
  try {
    // create JWT token 

    const { userId } = req
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    return res.status(200).json({
      message: message.LOGIN_SUCCESS,
      token: token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({

      message: message.ERROR_MESSAGE,

    });
  }
}

/** 
 
 * @param { req, res }
 * @returns JsonResponse
 */

// const viewProfile = async(req,res) =>  
// res.status(200).json(req.user)


/**
 * Export as a single common js module
 */
module.exports = {
  adminCreate,
  adminLogin,
  // viewProfile,
};
