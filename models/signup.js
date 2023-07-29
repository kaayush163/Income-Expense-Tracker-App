const Sequelize = require('sequelize');

const sequelize =  require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    ispremiumuser: Sequelize.BOOLEAN,
    totalBalance: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
    },
    totalincome: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
    },
    totalexpense: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
    }

},
{
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // If don't want createdAt
    createdAt: false,
    // If don't want updatedAt
    updatedAt: false,
},
// {
//     raw:true
// }
);

module.exports = User;