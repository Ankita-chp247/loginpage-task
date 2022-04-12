"use strict";

const { message } = require("../common/message");
const OrganizationModel = require("../models/OrganizationModel");
const { validationResult } = require("express-validator");



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
      createdBy: req.body,
      updatedBy: req.body,
    });

    await organization.save();
    res.status(200).send(organization);
    console.log("Organization created successfully!");
    ({
      message: message.ORGANIZATION_ADDED
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,

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

    //ascending order
    let sortBy = { state: 1 }

    if (sort) {
      sortBy = JSON.parse(sort)
    }

    // search in name
    let condition = {};
    
    if (search) {
      condition["name"] = { $regex: search, $options: "i" };
    }

    //show in organization list
    const organization = await OrganizationModel.find(condition)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("name country state city ")
      .sort(sortBy);

    return res.status(200).json({
      totalorganization: organization.length,
      organization,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,
    });
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
      message: error.message ? error.message : message.ERROR_MESSAGE,
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
    const deleteOrganization = await OrganizationModel.findByIdAndDelete(req.params.id);

    res.json(deleteOrganization);

    console.log("Organization data  delete successfully!");

  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,

    });
  }
};



/**
 * Export as a single common js module
 */
module.exports = {

  createOrganization,
  organizationList,
  updateOranization,
  deleteOrganization
};
