const express = require('express')
const router = express.Router()
const { OrganizationController } = require('../controllers')
const { OrganizationValidations } = require("../validations")
const { Validations } = require('../middleware')



router.post('/org', OrganizationValidations.organizationValidation, Validations.handleValidationErrors,
OrganizationController.createOrganization)
router.put('/up/:id', OrganizationController.updateOranization)
router.delete('/:id', OrganizationController.deleteOrganization)
router.get('/list', OrganizationController.organizationList)   
router.get('/detail', OrganizationController.organizationDetails)                                                        

module.exports = router               