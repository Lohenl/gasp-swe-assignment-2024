export default (sequelize, DataTypes) => sequelize.define(
    'Benefit',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        amount: DataTypes.BIGINT,
        description: DataTypes.STRING(1000),
    }
);
