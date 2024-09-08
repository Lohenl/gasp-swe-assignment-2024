export default (sequelize, DataTypes) => sequelize.define(
    'Applicant',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        HouseholdId: DataTypes.UUID,
        EmploymentStatusId: DataTypes.INTEGER,
        MaritalStatusId: DataTypes.INTEGER,
        GenderId: DataTypes.INTEGER,
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: DataTypes.STRING(50),
        mobile_no: DataTypes.STRING(31),
        birth_date: DataTypes.DATEONLY,
    }
);
