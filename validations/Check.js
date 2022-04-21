const UserModel = require("../models/UserModel")
const bcrypt = require("bcryptjs")

/**
 * checkout admin email and password exist or not
 * */
 const checkValidations = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });   

        console.log("user", user)               

        if (!user) {
            return res.status(422).json({
                success: false,
                message:"Registerd",
                error: error
            });
        }

        //const isMatch = await bcrypt.compare(password, user.password);
        if(user.password== password)
        {
            req.userId = user.id
            next();
        }

//console.log(isMatch)
        // if(isMatch){
        //     req.userId = user.id
        //     next();
        // }
      
        if (user.email !== email) {
            
            return res.status(422).json({
                message: " Email incorect!"
            });
        }

    } catch (error) {

    
        return res.status(422).json({
            message: "User details incorrect !"
        });
  }
}

module.exports = { 
    checkValidations,
};