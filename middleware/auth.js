// require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/signup');

const authenticate = (req, res, next) => { 

    try {
        let token = req.header('Authorization') ; 
        //token = token.split(" ")[1];

        //console.log(token);
        let user = jwt.verify(token,process.env.TOKEN_SECRET); //in verify we have to decrypt userid with help of secret key THIS IS DECRYPTION
        console.log('userId>>>>>',user.userId);      

        User.findByPk(user.userId).then((user) => {  //user we get the user object from findbypk for a particular user using decrypt token verify
            //console.log(user);
            req.user = user; 
            //console.log(req.user);
            next(); 
        })
    } 
    catch (err) 
    {
        //console.log(err);
        return res.status(401).json({ error:"problem in auth.js", success: false });
    }
};

module.exports = {authenticate};