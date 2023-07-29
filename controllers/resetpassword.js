////doing with sendinblue brevo
const uuid = require('uuid');
// const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const Sib = require('sib-api-v3-sdk');

const User = require('../models/signup');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {  
    try {
        const { email } =  req.body;
      
        const user = await User.findOne({where : { email }});  /// user table se pura wo specific email wala row lelega
        if(user){       
            const id = uuid.v4();
            console.log('id>>>>>',id);
            user.createForgotpassword({ id , active: true })  ///// createForgotpassword is a sequelize method function
                .catch(err => {
                    throw new Error(err)
                })

             const client = Sib.ApiClient.instance;  /// we take instance from Sib apiclient
             const apiKey = client.authentications['api-key']  //apiKey is object from client we got
             apiKey.apiKey = process.env.API_KEY;

            const tranEmailApi = new Sib.TransactionalEmailsApi()
            const sender = {  //of me    ///this will contains the information sender
               email: 'kaayush163@gmail.com',
            }

            const receivers = [   // means iam sending the reset link to the various users who forgotten their password this shou;d be array of objects //contain of other users
              {
                email: email
              }
            ]
            tranEmailApi.sendTransacEmail({ ///transEmail is an asynchrounous task so do it by thencatch or async await
                sender,
                to: receivers,
                subject: "Sending with sendinblue",
                textContent: `Sharpener will help you to become {{params}}`,  //you can pass html content also here
                params : {
                    role: 'Full Stack',
                },
                htmlContent:`<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`        /////html content overide text content whatever you written in text only html will seen in emil
            }).then((response) => {
                console.log('response',response)
                //return res.status(response).json({message: 'Link to reset password sent to your mail ', sucess: true})
            })
            .catch((error) => {
                throw new Error(error);
            })
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.status(500).json({ message: err, success: false });
    }

}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {   ///genSalt function, pass the plain password and the generated salt to the bcrypt. hash() method to hash the password. 
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}
