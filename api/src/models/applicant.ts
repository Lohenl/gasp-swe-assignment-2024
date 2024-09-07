export default (sequelize, DataTypes) => sequelize.define(
    'Applicant',
    {
        name: DataTypes.STRING(50),
        email: DataTypes.STRING(50),
        mobile_no: DataTypes.STRING(31),
        birth_date: DataTypes.DATEONLY,
    }
);
