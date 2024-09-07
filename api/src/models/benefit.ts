export default (sequelize, DataTypes) => sequelize.define(
    'Benefit',
    {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        amount: DataTypes.BIGINT,
        description: DataTypes.STRING(1000),
    }
);
