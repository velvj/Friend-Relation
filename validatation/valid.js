const Joi = require('joi')
const jwt = require('jsonwebtoken');
const { token } = require('morgan');


const Valid = Joi.object({
    name: Joi.string().required().min(3),

    phone: Joi.number().required().min(1000000000).max(9999999999).error(new Error('Please enter a valid phone number')),

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),

    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Please enter a valid password')),
    isAdmin: Joi.boolean()

})
const signupUser = async (req, res, next) => {
    try {

        await Valid.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
};
const Validating = Joi.object({

    username: Joi.string().email().allow("").error(new Error('Please enter a valid Email ID')).required(),

    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).error(new Error('Please enter a valid Password')).required()


})

const loginUser = async (req, res, next) => {
    try {

        let { val } = await Validating.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
};

const authToken = async (req, res, next) => {
    try {
        const token = await req.header("x-auth-token");
        if (!token) return res.status(403).json({ status: 403, message: "access denied no token provided" })
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log("decoded", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        if (err)
            err.status = res.status(403).json({ status: 403, message: err.message || err })
        next(err)

    }

}


//is ADMIN
const isAdmin = async (req, res, next) => {
    try {
        if (req.user.isAdmin === false) {
            return next(res.status(401).send({ status: 401, message: "user not a admin" }));
        }
        next()
    } catch (err) {
        if (err)
            err.status = res.status(403).json({ status: 403, message: err.message || err })
        next(err)

    }

}


const contactval = Joi.object({



    requester: Joi.string().hex().length(24).required(),

    recipient: Joi.string().hex().length(24).required()


})

const AddReq = async (req, res, next) => {
    try {

        await contactval.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
};

module.exports = { signupUser, loginUser, authToken, AddReq, isAdmin }