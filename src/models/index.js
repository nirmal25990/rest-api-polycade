'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//sequelize sync
//  sequelize.sync();
//sequelize force sync
sequelize.sync({ force: true })
  .then(async () => {
    console.log(`Database & tables created!`)
    const Price = require('../models').price;
    await Price.create({
      "name": "Default",
      "pricing": [
        {
          "price": 3,
          "name": "10 minutes",
          "value": 10
        },
        {
          "price": 5,
          "name": "20 minutes",
          "value": 20
        },
        {
          "price": 15,
          "name": "60 minutes",
          "value": 60
        }
      ]
    })
  })
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
