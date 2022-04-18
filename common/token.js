const UserModel =  require ("../models/UserModel");
const { decode } = require ("../common/encode_decode")
const message = require ("../common/message")


/**
 * validate the token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const tokenVerification = async (req, res, next) => {                             
    try {
        
       // const { headers: { authorization }, } = req;


        const token = req.headers['x-access-token'];  
        console.log(token)
                                                                                                                                                      
        const id  = await decode(token);

        console.log(" get " + id)  
        const user = await UserModel.findById(id)                                                                                                                                                                                         
 
        if (!user) {                                                       
            return res.status(500).json(                                                                                                                              
                {                                                      
                    message: message.USER_NOT_FOUND                                                                                                                                                                
                });    
        }    
        //req.user = id;                                                                                        
      return next();                                                                                                          
    
    } catch (error) {                                                                                       
        console.log(error);                                       
        return res.status(500).json(                                                                         
            {
                message: message.INVALID_TOKEN ,
            });
    }
};

module.exports = {
    tokenVerification,
}