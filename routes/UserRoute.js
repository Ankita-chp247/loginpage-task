const express = require('express');
const router = express.Router()
const { UserController } = require('../controllers')
const { Validations } = require('../middleware')
const { UserValidations } = require("../validations");
const{ tokenVerification } = require ("../common/token")

const upload = require('../common/upload');


router.post("/signup", upload.single("file"), UserValidations.SignupValidations,
 Validations.handleValidationErrors, UserController.userCreate);

router.post("/login",  UserController.userLogin)
router.put('/:id', tokenVerification, UserController.updateUser)
router.delete('/:id',tokenVerification, UserController.deleteUser)
router.get('/list', tokenVerification,UserController.userList)
router.get('/detail/:id', UserController.userDetails)

module.exports = router      
