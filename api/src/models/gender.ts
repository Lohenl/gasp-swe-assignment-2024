export default (sequelize, DataTypes) => sequelize.define(
    'Gender',
    {
        name:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }
);
