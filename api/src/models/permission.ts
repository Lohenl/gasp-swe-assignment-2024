export default (sequelize, DataTypes) => sequelize.define(
    'Permission',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        AdminRoleId: DataTypes.UUID,
        PermissionScopeId: DataTypes.UUID,
    }
);
