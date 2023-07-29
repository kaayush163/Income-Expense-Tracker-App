const Expense = require("../models/expense");
const User = require("../models/signup");
const sequelize = require('../util/database');
const S3Service = require('../services/S3services');
const UserServices = require('../services/userservices')


function isValid(string){
  if(string == undefined || string.length === 0){
      return true;
  }else {
      return false;
  }
}


const downloadexpense = async(req,res) => {
 
  try{
    if(req.user.ispremiumuser == true) {
      const expenses = await UserServices.getExpenses(req,res)
      // const expenses =await Expense.findAll({where:{userId:req.user.id}})
       const userId = req.user.id;
       console.log('expenses>>>>>>>>>>>>',expenses)
       console.log('expenses of user>>>>>',expenses[0].dataValues);
       
       
       const stringifiedExpenses = JSON.stringify(expenses); 
       console.log('stringified>>>>',stringifiedExpenses);
 
       const filename = `Expense${userId}/${new Date()}.txt`;              //////we dont want out old data get overrirdden when again click on click download file so we rather make text file mentioning with date and userid so get created 
       console.log(filename);
 
       //define a fucntion to call for S3 aws
       let fileURl=await S3Service.uploadToS3(stringifiedExpenses,filename);   
       
       await S3Service.urlExport(fileURl, userId);   /// this will save the url we are sending to the s3 database it save in the mysql table url


       console.log(fileURl);    
       res.status(201).json({fileURl, success: true})                            
    }else {
      res.status(402).json("You are not a premium user");
    }  
  }
  catch(err){
    console.log(err);
    res.satus(500).json({err:err,fileURl:'', success:false})  /// t his send the error to the frontend and frontend we do red colo inner HTml text if you go and see
  }
  
}


exports.getUpdateExpense = async(req,res) => {
  try{
    // const all = await Expense.findAll({where : {userId: req.user.id}});
    const all = await User.findAll({where : {id: req.user.id}});
    console.log('alldetail tot>>>>',all);
     return res.status(200).json({all, success: true});
     
  }
  catch(err){
    console.log(err);
    return res.status(500).json({error:err, status:false,message:"Not able to get all expenses"});
  }
  
}


exports.getExpense = async (req, res, next) => {
  try {

    const PAGE = req.query.page || 1;
    console.log("pages>>>",PAGE);
    const ITEMS_PER_PAGE = +req.query.count || 5;    ////we doing query request in expense js with ? in dynamic now we can set 5,10,15 you can seeoption s in expense html
    console.log(ITEMS_PER_PAGE);
    const userId = req.user.id;
    //console.log(userId);

    const count = await Expense.count({where:{userId:userId}})
    console.log('Number of records', count);

    const pageData = await Expense.findAll({where:{userId: userId}, limit: ITEMS_PER_PAGE, offset: (PAGE - 1) * ITEMS_PER_PAGE})
    .then((rows) => {
      //console.log("rows>>>>>>>>>>",rows);
      
      console.log("currentpage",PAGE);
      console.log("nextpage",Number(PAGE)+1);
      console.log("lastpage",Math.ceil(count / ITEMS_PER_PAGE));
      
      res.json({         
        rows:rows,
        currentpage: PAGE,
        hasnextpage:(ITEMS_PER_PAGE*PAGE)<count,   
        nextpage:Number(PAGE)+1,   
        haspreviouspage: PAGE > 1,
        previouspage: PAGE - 1,
        lastpage: Math.ceil(count / ITEMS_PER_PAGE)
      })
      
      //console.log('row.data>>>>>', rows);
      return rows.data
    })
    .catch(err => console.log(err));

  } 
  catch (err) {
    //aways do console.log(err) also to know error betetr
    console.log(err);
    return res.status(500).json({error:err, status:false,message:"Not able to get all expenses"});
  }
};

exports.postExpense = async (req, res, next) => {
  const t = await sequelize.transaction(); 
  try {
    
    const amount = req.body.amount;
    const text = req.body.text;
    const category = req.body.category;
    if(isValid(amount) || isValid(text) || isValid(category)){
      return res.status(400).json({success: false, message: 'Some Parameter is missing'});
    }
    const data = await Expense.create({
      text : text,
      amount: amount,
      category: category,
      userId: req.user.id             
    },{
      transaction: t
    });

    const totalBal = Number(req.user.totalBalance) + amount
    console.log('totalBal>>>>',totalBal);

    let totalexp = Number(req.user.totalexpense);
    let totalinc = Number(req.user.totalincome);
    
     if(amount<0){
      totalexp = Number(req.user.totalexpense) + amount;
      console.log('totalexp>>>',totalexp);
     }
     else if(amount>=0){
      totalinc = Number(req.user.totalincome) + amount;
      console.log('totalinc>>>',totalinc);
     }
    
    await User.update({   
      totalBalance : totalBal,
      totalincome : totalinc,
      totalexpense : totalexp
    }, {
      where: {id: req.user.id},
      transaction:t      
    })

    await t.commit(); 
    return res.status(201).json({data, success: true});
  } catch (err) {
    await t.rollback();    
    return res.status(500).json({ success: false, error: err });
  }
};


exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.expenseId;              //expenseId same as that of routes
    console.log('expenseid>>>>',expenseId);
    const expenseField = await Expense.findByPk(expenseId);
    console.log('expensefirled>>>>',expenseField.amount);

    if(expenseId == undefined || expenseId.length === 0){
     return res.status(400).json({success: false});                //put return in res.satus always otherwise the code will go down IMP!!!
    }

    // await expenseField.destroy({where: {expenseId: expenseId}});
    await expenseField.destroy({where : {userId: req.user.id}}, {transaction:t});
    const totalBal = Number(req.user.totalBalance) - (expenseField.amount);                                                    
    console.log('totalBalance left>>',totalBal);

    let totalexp = Number(req.user.totalexpense);
    let totalinc = Number(req.user.totalincome);
    
     if(expenseField.amount < 0){
      totalexp = Number(req.user.totalexpense) - expenseField.amount;
      console.log('totalexp>>>',totalexp);
     }
     else if(expenseField.amount >= 0){
      totalinc = Number(req.user.totalincome) - expenseField.amount;
      console.log('totalinc>>>',totalinc);
     }
    

    await User.update({   
      totalBalance : totalBal,
      totalincome : totalinc,
      totalexpense : totalexp
    }, {
      where: {id: req.user.id},
      transaction:t    
    })
    await t.commit();
    return res.status(201).json({ delete: expenseField , success: true, message: "deleted successfully"});
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete"})
  }
};

exports.editExpense = async (req, res, next) => {
  const t = await sequelize.transaction(); 
  try {
    const expenseId = req.params.expenseId;    //as same as used in routes
    console.log('expenseid>>>>',expenseId);
    const expenseField = await Expense.findByPk(expenseId);
    console.log('expensefirled>>>>',expenseField.amount);

    const amount = req.body.amount;
    const text = req.body.text;
    const category = req.body.category;

    if(isValid(amount) || isValid(text) || isValid(category) || expenseId == undefined || expenseId.length === 0){
      return res.status(400).json({success: false, message:"some edit parameter is missing"});
    }
    const data = await Expense.update(
      {
        text : text,
        amount: amount,
        category: category,
        
      },
      { where: { id: expenseId, userId: req.user.id },},
      {
        transaction : t
      }
    );

    const totalBal = Number(req.user.totalBalance) - (expenseField.amount) + amount;    ////expensefiels what the previous before edit and amount what after we done edited in amount                                                  
    console.log('totalBal>>',totalBal);

    let totalexp = Number(req.user.totalexpense);
    let totalinc = Number(req.user.totalincome);
    
     if(expenseField.amount < 0){
      totalexp = Number(req.user.totalexpense) - expenseField.amount + amount;
      console.log('totalexp>>>',totalexp);
     }
     else if(expenseField.amount >= 0){
      totalinc = Number(req.user.totalincome) - expenseField.amount + amount;
      console.log('totalinc>>>',totalinc);
     }

    await User.update({
      totalBalance: totalBal,
      totalincome : totalinc,
      totalexpense : totalexp
    },{where: {id:req.user.id}}, {transaction: t})

    await t.commit();
    return res.status(201).json(data);
  } catch (err) {
    await t.rollback();
   return res.status(500).json({ error: err });
  }
};

module.exports.downloadexpense = downloadexpense;