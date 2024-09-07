export default (sequelize, DataTypes) => sequelize.define(
    'Administrator',
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
