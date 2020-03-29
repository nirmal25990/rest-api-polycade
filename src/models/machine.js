'use strict';
//model collection machine
module.exports = (sequelize, DataTypes) => {
    const Machine = sequelize.define('Machine', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: DataTypes.STRING,
    }, {});
    Machine.associate = function (models) {
        Machine.belongsTo(models.Price, {as: 'Price', foreignKey: 'priceId', targetKey: 'id'});
    };
    return Machine;
};