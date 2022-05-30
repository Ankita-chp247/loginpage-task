"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const OrganizationModelSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  name: {
    type: String, require: true,
  },
  country: {
    type: String, require: true,
  },
  state: {
    type: String, require: true,
  },
  city: {
    type: String, require: true,
  },


  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "organizations"
  },




  createdAt: {
    type: Date, default: Date.now
  },
  updatedAt: {
    type: Date, default: Date.now
  },
});
OrganizationModelSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
OrganizationModelSchema.pre('update', function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});
OrganizationModelSchema.pre('findOneAndUpdate', function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});
OrganizationModelSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('organization', OrganizationModelSchema);




