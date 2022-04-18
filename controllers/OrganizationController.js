"use strict";

const { message } = require("../common/message");
const OrganizationModel = require("../models/OrganizationModel");
const { validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");


/**
 * Create a record
 * @param { req, res }
 * @returns JsonResponse
 */

const createOrganization = async (req, res, next) => {

  try {
    const organization = await new OrganizationModel({
    
      name: req.body.name,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,                                    

    });
     await organization.save();
    res.status(200).json({
      message: message.ORGANIZATION_ADDED,   
      data: organization
    })
    console.log("Organization created successfully!");

  } catch (error) {
    return res.status(500).json({
      message: message.ERROR_MESSAGE,

    });
  }
};

/**
 * show organization to user use searching , sorting, pagination
 * Get only single record
 * @param { req, res }
 * @returns JsonResponse
 */

const organizationList = async (req, res, next) => {
  try {

    const { search = "", page = 1, limit = 10, sort } = req.query;

    let sortOrder = { name: -1 };
    if (sort == "asc") {
      sortOrder = {                  
        name: 1,
      };
    } else if (sort == "dsc") {
      sortOrder = {
        name: -1,
      };
    }
    // search in name
    let condition = {};

    if (search) {
      condition["name"] = { $regex: search, $options: "i" };
      
    }
      //show in user list
  const user = await UserModel .find(condition)
         .select("firstName lastName email password")                

        //show in organization list
    const organization = await OrganizationModel.find(condition)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("name country state city ")                              
      .sort(sortOrder);

    const totalorganizationList = await OrganizationModel.countDocuments(condition);
    if (!totalorganizationList) {

      return res.status(400).json({
        message: message.DATA_NOT_FOUND,
      });
    }
    return res.status(200).json({
      TotalorganizationList: totalorganizationList,
      organization,
      totaluser: user.length,
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

const organizationDetails = async (req, res) => {
  try {
    // show 
    const organization = await OrganizationModel.find();            

    if (organization) {

      return res.status(422).json({
        errors: { message: message.ORGANIZATION_NOT_Found }
      });
    }
    return res.status(200).json({
      data: organization,
    });
  } catch (error) {
    return res.status(500).json({
      message: message.ERROR_MESSAGE
    })
  }
}

/**
 * update a record
 * @param { req, res }
 * @returns JsonResponse
 **/

const updateOranization = async (req, res, next) => {
  try {
    const organization = await OrganizationModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.send(organization);       
    console.log("organization data updated successfully!");
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

const deleteOrganization = async (req, res, next) => {
  try {
    //const deleteuser = await user.find()
    const id = req.params.id;
    const organization = await OrganizationModel.findOne({ _id: id });
    if (organization) {
      return res.status(404).json({
        message: message.DATA_NOT_FOUND,
      });
    }
    await OrganizationModel.deleteOne({ _id: id })

    return res.status(200).json({ message: "organization deleted successfully!" });

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

  createOrganization,
  organizationList,
  organizationDetails,
  updateOranization,
  deleteOrganization
};
