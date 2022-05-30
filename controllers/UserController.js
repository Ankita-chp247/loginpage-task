"use strict";

const { UserModel } = require("../models")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")
const { message } = require("../common/message");
const { Email, AvailableTemplates } = require("../utils/Email");
const { encode } = require("../common/encode_decode");


/**
 * user login
 * Create a record
 * @param { req, res }
 * @returns JsonResponse
 */

const userCreate = async (req, res) => {
  try {

    const { file } = req;
    console.log(file)

    const { firstName, lastName, email, password, userRole, organizationId } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    // save the data in database of user 
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userRole,
      image: file.filename,
      organizationId
    });

    try {
      //const { email } = req.body
      const email = new Email();

      await email.setTemplate(AvailableTemplates.REGISTERED_USER, {
        firstName: `${user.firstName}`,
        lastName: `${user.lastName}`,
        password: `${password}`,
        email: `${user.email}`
      })
      await email.sendEmail(user.email);
      return res.status(201).json({ message: message.USER_REGISTRATION, data: user });
    } catch (error) {
      console.log(error);
      return res.status(201).json({ message: message.USER_REGISTRATION_NO_EMAIL, data: user });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};

/**
 * login a user and generate JWT token
 * @param { req, res }
 * @returns JsonResponse
 */

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: message.DATA_NOT_FOUND
      })
    }
    const isPasswordCheck = await bcrypt.compare(password, user.password);
    if (!isPasswordCheck) {
      return res.status(422).json({
        errors: { message: message.PASSWORD_NOT_MATCH }
      });
    }
    const keyaccsess = {
      id: user._Id
    }
    const token = jwt.sign(keyaccsess, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    console.log("user login successfully!")
    return res.status(200).json({
      message: message.LOGIN_SUCCESS,
      token
      //token: `Bearer ${await encode({
      //id: user._id,
      //})}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
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

    const { search = "", page = 1, limit = 10, sort, sortBy } = req.query;

    //search in sorting
    console.log("sort..", sort);
    let sortOrder = { [sortBy]: sort === "desc" ? -1 : 1 };

    // search in name
    let condition = {};

    if (search) {
      condition["firstName"] = { $regex: search, $options: "i" };
    }

    //aggregation used 
    const user = await UserModel.aggregate([{
      $lookup: {
        from: "organizations",
        localField: "organizationId",
        foreignField: "_id",
        as: "organization",
      },
    },

    {
      $unwind: "$organization",
    },

    // {
    //   $project: {
    //     name: "$organization.country",
    //     orgstate:"$organization.state",
    //     city: "$organization.city",
    //     username: "$firstName",
    //     userlastName: "$lastName",
    //     email: "$email",
    //     image: "$image"
    //   }
    // }

    {
      $group: {
        _id: {
          organizationid: "$organizationId",
          state: "$organization.state",
          city: "$organization.city",
          username: "$firstName",
          image: "$image"
        }
      }
    },
    ])

    //show in user list pagination
    // const user = await UserModel.find(condition)
    //   .limit(limit * 1)
    //   .skip((page - 1) * limit)
    //   .select("firstName lastName email password ")
    //   .sort(sortOrder);

    const totaluserList = await UserModel.countDocuments(condition);
    if (!totaluserList) {
      return res.status(400).json({ message: message.DATA_NOT_FOUND, });
    }
    return res.status(200).json({
      TotaluserList: totaluserList,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
}

/**
 * update a record
 * @param { req, res }
 * @returns JsonResponse
 **/

const userDetails = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;
    const userDetails = await UserModel.findOne({ _id: id })

    if (userDetails) {
      return res.status(200).json({
        message: message.USER_DETAILS, userDetails
      });
    }
    return res.status(404).json({
      message: message.USER_NOT_FOUND
    });
  } catch (error) {
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
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
    const { body, userId } = req
    console.log("userId", userId)

    const user = await UserModel.find({ _id: { $ne: id }, email: body.email }).select({ "password": 0 })

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
      message: message.ERROR_MESSAGE,
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
    const id = req.params.id;
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        message: message.DATA_NOT_FOUND,
      });
    }
    await UserModel.deleteOne({ _id: id })

    return res.status(200).json({ message: message.USER_DATA_DELETED });

  } catch (error) {
    return res.status(500).json({
      message: message.ERROR_MESSAGE,

    });
  }
};


/**
 * Export as a single common js module
 */

module.exports = {
  userCreate,
  userLogin,
  userList,
  userDetails,
  updateUser,
  deleteUser
};
