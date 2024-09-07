export default (sequelize, DataTypes) => sequelize.define(
    'Scheme',
    {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        eligibility_criteria: DataTypes.TEXT,
        description: DataTypes.STRING(1000),
    }
);
