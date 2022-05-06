const UserModel = require("../models/UserModel");
const { decode } = require("../common/encode_decode")
const message = require("../common/message")


/**
 * validate the token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const tokenVerification = async (req, res, next) => {
    try {
        const {
            headers: { authorization },
        } = req;

        const token = authorization.split(" ")[1];

        const { id } = await decode(token);

        console.log("*tttttttttttttttttttid",id)

        const userDetails = await UserModel.findById(id);
        console.log(userDetails._id)
        if (!userDetails) {
            return res.status(404).json({

                message: message.DATA_NOT_FOUND,
            });
        }
        req.userId = id;

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                message: message.INVALID_TOKEN,
            });
    }
};

module.exports = {
    tokenVerification,
}