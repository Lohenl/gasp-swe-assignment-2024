export default (sequelize, DataTypes) => sequelize.define(
    'ApplicationWorkflowEvent',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
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
