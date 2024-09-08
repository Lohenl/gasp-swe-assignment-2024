export default (sequelize, DataTypes) => sequelize.define(
    'Application',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        outcome: {
            type: DataTypes.STRING, // ought to be a codetable, and ought to be expanded into workflow entities
        }
    })
