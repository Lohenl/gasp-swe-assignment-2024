export default (sequelize, DataTypes) => sequelize.define(
    'Relationship',
    {
        name:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }
);
