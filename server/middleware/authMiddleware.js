const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");


const protect = async(req, res, next) => {

    try{

        let token;

        const { authorization } = req.headers;

        if(authorization && authorization.startsWith("Bearer")){

            try{

                token = authorization.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                req.user = await User.findById(decoded.id).select("-password");

                next();

            } catch(err) {
                throw new Error("Nicht autorisiert");
            }
        };

        if(!token) {
            throw new Error("Keine Berechtigung");
        }
        
    } catch(err){

        res.status(401).json(err.message);

    };

};

module.exports = { protect };