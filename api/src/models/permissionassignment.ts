export default (sequelize, DataTypes) => sequelize.define(
    'PermissionAssignment',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        }
    }
);
