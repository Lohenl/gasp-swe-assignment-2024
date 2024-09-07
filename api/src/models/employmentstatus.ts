export default (sequelize, DataTypes) => sequelize.define(
    'EmploymentStatus',
    {
        name:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }
);
