'use strict';
//model collection machine
module.exports = (sequelize, DataTypes) => {
    const machine = sequelize.define('machine', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: DataTypes.STRING,
    }, {});
    machine.associate = function (models) {
        machine.belongsTo(models.price);
    };
    return machine;
};