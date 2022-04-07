const { body } = require("express-validator");



const organizationValidation = [
    body("name").not().isEmpty().withMessage("Enter a name"),
    body("country").not().isEmpty().withMessage("Enter a country name"),
    body("state").not().isEmpty().withMessage("Enter a state name"),
    body("city").not().isEmpty().withMessage("Enter a city name"),


    
];

module.exports = {
    organizationValidation,
};