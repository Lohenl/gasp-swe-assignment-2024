export default (sequelize, DataTypes) => sequelize.define(
    'ApplicationWorkflowEvent',
    {
        date: {
            type: DataTypes.DATE, // might be unnecessary because sequelize has timestamps
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: DataTypes.STRING(1000),
    }
);
