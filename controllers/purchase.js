const jwt = require("jsonwebtoken");
const Razorpay = require('razorpay');
const Order = require('../models/order');
// const userController = require('./signup');


exports.purchasepremium = async(req,res) => {
    try{
        var rzp = new Razorpay({
            key_secret : process.env.RAZORPAY_KEY_SECRET,
            key_id : process.env.RAZORPAY_KEY_ID,
        })
        const amount = 2500;

        rzp.orders.create({amount, currency:"INR"},(err, order) => {    
            console.log('orderid>>>>>',order.id);
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            Order.create({                                              //// after taking from rzp.orders it will create in order table with values
                userId: req.user.id,                                     //// req.userid come from globally 
                orderid: order.id,
                status:'PENDING'
            }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id}); 
            });      
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong', error: err})
    }
}

function generateAccessToken(userid,name,ispremiumuser){        
   return jwt.sign({userId : userid,name: name,ispremiumuser}, process.env.TOKEN_SECRET);  
}



exports.updateTransaction = async (req,res) => {   
    try{
        const userId = req.user.id;   
        const { payment_id, order_id} = req.body;

        const order=await Order.findOne({where: {orderid: order_id}})   
        
        console.log(order);

        const promise1 = order.update({ paymentid: payment_id, status:'SUCCESSFUL'});
        const promise2 = req.user.update({ ispremiumuser: true })

        Promise.all([promise1,promise2]).then(() => {
            return res.status(202).json({
                success: true, 
                message:"Transaction success",
                token: generateAccessToken(userId,undefined,true)  
                
            });
        }).catch((err) => {
            throw new Error(err);
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: err, success: false, message:"Payment failed"});
    }
}