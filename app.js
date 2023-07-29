///do inittialize dotnv befor sequelize then only doteven first take all the password keys to sequelize
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');   /// Helmet is a nodejs package that helps protect your server from some well-known web vulnerabilities by setting HTTP response headers appropriately
const morgan = require('morgan');
const fs = require('fs');
// const compression = require('compression');
// const https = require('https'); 
dotenv.config();

const app = express();

console.log(process.env.NODE_ENV);

app.use(express.static(path.join(__dirname,"./views")));
app.use(bodyParser.json());
app.use(cors());
//const errorController = require('./controllers/error');


const userRoutes = require('./routes/signup');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumfeature');
const resetPasswordRoutes = require('./routes/resetpassword')
app.use('/user',userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),{flags: 'a'}   ///flag a will append new data to access log if not write flag a it will overwrtite the data previous one
);   

app.use(helmet());
//app.use(compression());   ///no need in client side rendering
app.use(morgan('combined',{stream:accessLogStream}));   ///used for logging request to chech request situtations GET,POST everything

const sequelize = require('./util/database');      // to use this automaticaally crete tables for you

//app.use(errorController.get404);
const User = require('./models/signup');
const Expense = require('./models/expense');
const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');
const OldUrls = require('./models/downloadurlsModel');


// app.use('/',(req,res) => {   ///whatever next routes come it goes to frontend files  ///we want to make it dynamic
//     console.log('urls', req.url);     ////we are doing sending frontend to the cloud as well
//     // res.sendFile(path.join(__dirname,'./public/Login/index.html'));
//     res.sendFile(path.join(__dirname,`public/${req.url}`));  /// now dynamically can go to index.html-> dignup html then expense html
// })


//, {foreignKey: 'userId'}
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(OldUrls);
OldUrls.belongsTo(User);

// const privateKey = fs.readFileSync('server.key')   ///read private key then we will do https
// const certificate = fs.readFileSync('server.cert');  ////to read certificate file from root folder


sequelize.sync()               //here the table will create by sync with model user.js .define
.then((result) => {
   // console.log(result);
    app.listen(3000);
    
})
.catch(err => {
    console.log(err);
});
