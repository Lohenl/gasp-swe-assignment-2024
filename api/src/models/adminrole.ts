export default (sequelize, DataTypes) => sequelize.define(
    'AdminRole',
    {
        name:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }
);
