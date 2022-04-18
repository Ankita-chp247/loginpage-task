const express = require('express');

const router = express.Router()
const { AuthController } = require('../controllers')
const { Validations } = require('../middleware')
const { UserValidations } = require("../validations");
const {CheckValidations} = require("../validations")



router.post("/signup", UserValidations.SignupValidations, Validations.handleValidationErrors,
    AuthController.adminCreate);
    
router.post("/login", CheckValidations.checkValidations,  AuthController.adminLogin);



module.exports = router      
