const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Expense = sequelize.define("expense", {   //to add attributes in table expense

  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  text: Sequelize.STRING,

  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  }
},
{
timestamps: false,
createdAt: false,
updatedAt: false,
}
);

module.exports = Expense;