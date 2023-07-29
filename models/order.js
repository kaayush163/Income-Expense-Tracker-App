const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    paymentid: Sequelize.STRING,  //it will you get on successful payment not get initially when you done payment then you get this
    orderid:Sequelize.STRING,   //what we get from razor pay on click on buy premium and order id generated
    status: Sequelize.STRING    //current payment would be pending once done it will be success
},
{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    }
)


module.exports = Order;