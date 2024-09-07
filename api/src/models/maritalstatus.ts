export default (sequelize, DataTypes) => sequelize.define(
    'MaritalStatus',
    {
        name:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }
);
