export default (sequelize, DataTypes) => sequelize.define(
    'Scheme',
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
        eligibility_criteria: DataTypes.TEXT,
        description: DataTypes.STRING(1000),
    }
);
