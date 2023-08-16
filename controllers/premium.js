const User = require('../models/signup');
const S3helper = require('../services/S3services');

exports.getUserLeaderboard = async(req,res) => {
    try{  
        const leaderboardofusers = await User.findAll({   
            order: [['totalBalance', 'DESC']]
        })

        res.status(200).json(leaderboardofusers);
}
catch(err){
    //console.log(err);
    throw new Error(err);
    //res.status(500).json({error:err, message:"not able to show laderboard",success: false});
    }
}


exports.downloadsList  = async (req, res, next)=>{
 
    try{
     if (req.user.ispremiumuser == true){
      const list = await S3helper.urlsFetch(req.user.id);
       return res.status(200).json({list, message: "Downloading file in a moment"})
    } else{
       return res.status(402).json("You are not a premium user")
    }
  
     }catch(err){
        console.log("error at download list")
         console.log(err)
     }
     
  }
