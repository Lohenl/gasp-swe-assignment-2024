export default (sequelize, DataTypes) => sequelize.define(
    'User',
    {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }
);
