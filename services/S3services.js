
const AWS = require('aws-sdk');     ///aws software development kit more like axios mode
const linkmodel  = require('../models/downloadurlsModel');

exports.uploadToS3 = (data,filename) => {
   
    const BUCKET_NAME = 'expensetracking1234';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
 
    let s3bucket = new AWS.S3({     ///inittializing S3 buket
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    
    })   
 
  
     var params = {
       Bucket: BUCKET_NAME,
       ///now we are gonna upload to get xml url
       Key: filename,   
       Body: data,
       ACL:'public-read'        //to read xml file publicalaly accessible
     }
   // })
     
    return new Promise((resolve,reject) => {
     s3bucket.upload(params, (err,s3response) => {    ///// It's an asynchronous task
       if(err){
         console.log('Something went wrong', err)
         reject(err);
       }else{
         resolve(s3response.Location)
         console.log('success', s3response);
       }
     })
   })
 
 }


exports.urlExport = async function(url, userid){

  try{
   await linkmodel.create({

       userId : userid,
       url : url
  })
//    console.log("Db Updation done")
  
  } catch(e){
   console.log(e)
   console.log("url exp")
  }

  
}

exports.urlsFetch = async function(userid){

  try{
  const list = await linkmodel.findAll({
      where : { userId : userid}
   })
  console.log("Db fetch done")
  return list;
  
  } catch(e){
   console.log(e)
  }

  
}