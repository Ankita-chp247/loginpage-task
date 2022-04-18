const UserModel = require("../models/UserModel")

/**
 * checkout admin email and password exist or not
 * */
 const checkValidations = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(422).json({
                success: false,
                message:  "Please login your account",
                error: error
            });
        }
        if (user.email === email && user.password === password) {

            next();
        }
        if (user.password !== password) {
            return res.status(422).send("Your Password is Incorrect !");
        }
        if (user.email !== email) {
            return res.status(422).send("Your Email is Incorrect !");
        }

    } catch (error) {
        return res.status(422).send("User Details Not Found !");
    }
} 

module.exports = { 
    checkValidations,
};