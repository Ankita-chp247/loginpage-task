const express = require('express')
const router = express.Router()
const { UserController } = require('../controllers')
const { Validations } = require('../middleware')
const { UserValidations } = require("../validations");


router.post("/signup", UserValidations.SignupValidations, Validations.handleValidationErrors,
    UserController.loginUser);

router.post("/login", UserController.userLoginAction)
router.put('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)
router.get('/list', UserController.userList)

module.exports = router      
