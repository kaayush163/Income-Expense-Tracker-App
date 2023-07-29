const User = require("../models/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else {
        return false;
    }
}
const postUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const userExist = await User.findAll({where: {email:email}});
    console.log('userExist>>',userExist);
    if(userExist && userExist.length>0){
      return res.status(404).json({ message: "User already Exists, Please Login" });
    }
    else if(isValid(name) || isValid(email) || isValid(password)){
        return res.status(400).json({err: "bad parameters . Something is missing in details"});
    }
    else{
    bcrypt.hash(password, 10, async (err, hash) => {     //this 10 is salt round
        if (err) {
          res.json({ message: "Unable to create new user" });
        }else{
          await User.create({ 
           name:name, 
           password: hash,
           email:email,
           ispremiumuser: false,
           totalBalance:0,
           totalincome:0,
           totalexpense:0
          })
          return res.status(201).json({ message: "User Signup successful",success:true});
        } 
      })
    } 
  } 
  catch(err) {
    return res.status(500).json({ error: err });
  }
};

const generateAccessToken = (id,name,ispremiumuser) => {          
  return jwt.sign({userId : id, name: name, ispremiumuser}, process.env.TOKEN_SECRET);  
}


const postlogin = async (req, res, next) => {
    try {
      const email = req.body.email;
      //console.log(email);
      const password = req.body.password;
      //console.log(password);
      if(isValid(email) || isValid(password)){
        return res.status(400).json({err: "You haven't fill the data properly.Something is missing!!!"});
      }
      else{
        const userExist = await User.findAll({where: { email } });
        console.log(userExist[0].dataValues);
        if(userExist) {
          bcrypt.compare(password,userExist[0].dataValues.password,(err, result) => {   // not put res instead of result otherwise overiiding becoz this is a cal back function
            if (err) {
              throw new Error("Something went wrong");
            }
            if (result) {    //if result ===  true
              return res.status(201).json({ 
              message: "User logged in successfully", 
              success: true, 
              token: generateAccessToken(userExist[0].dataValues.id, userExist[0].dataValues.name, userExist[0].dataValues.ispremiumuser)
            });   //passing id whatever you enter in login and send to backend
            } else {
              return res.status(401).json({ message: "User not authorized. Wrong password", success: false});
            }
          });
         }else if(!userExist){
          return res.status(404).json({error: "User doesn't exist. Try with different email",
            success: false, 
            message: "User doen't exist"
          });
         }
      }
    } 
    catch (err) {
      return res.status(500).json({ message: err ,success: false });
    }

};


module.exports = {postUser, postlogin}