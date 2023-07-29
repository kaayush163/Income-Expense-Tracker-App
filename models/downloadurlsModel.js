

const Sequelize = require ('sequelize');


const sequelizedb  = require('../util/database');


const linksModel =  sequelizedb.define('urls',{
  id : { 
    type : Sequelize.INTEGER,
    autoIncrement: true, 
    allowNull : false,
    primaryKey : true,
  },

  url : { 
    type : Sequelize.STRING,
    allowNull : false,    
  },
}
,
// {
// timestamps: false,
// createdAt: false,
// updatedAt: false,
// }
)

module.exports = linksModel;
