'use strict';
//default pricing
const default_pricing = ["{\"price\":3,\"name\":\"10 minutes\",\"value\":10}","{\"price\":5,\"name\":\"20 minutes\",\"value\":20}","{\"price\":15,\"name\":\"60 minutes\",\"value\":60}"]

//model collection price
module.exports = (sequelize, DataTypes) => {
    const Price = sequelize.define('Price', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: DataTypes.STRING,
        pricing: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: default_pricing
        },
    }, {});
    Price.associate = function (models) {
        Price.hasMany(models.Machine, { as: 'Price', foreignKey: 'priceId', sourceKey: 'id'});
    };
    return Price;
};