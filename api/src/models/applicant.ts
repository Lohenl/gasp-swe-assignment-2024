export default (sequelize, DataTypes) => sequelize.define(
    'Applicant',
    {
        name: DataTypes.TEXT,
        favoriteColor: {
            type: DataTypes.TEXT,
            defaultValue: 'green',
        },
        age: DataTypes.INTEGER,
        cash: DataTypes.INTEGER,
    }
);
