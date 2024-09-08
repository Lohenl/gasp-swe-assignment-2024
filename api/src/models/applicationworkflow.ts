export default (sequelize, DataTypes) => sequelize.define(
    'ApplicationWorkflow',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM('eligible', 'not_eligible'),
            allowNull: false,
        },
        date_created: {
            type: DataTypes.DATE, // might be unnecessary because sequelize has timestamps
            allowNull: false,
        },
        date_modified: {
            type: DataTypes.DATE, // might be unnecessary because sequelize has timestamps
            allowNull: false,
        },
    }
);
