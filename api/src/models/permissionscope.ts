export default (sequelize, DataTypes) => sequelize.define(
    'PermissionScope',
    {
        name:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }
);
