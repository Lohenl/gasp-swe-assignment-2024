import { Sequelize, DataTypes, Model } from 'sequelize';

// TODO: testing singleton, to turn into a module for DRY
const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres'
});

class Applicant extends Model { }

Applicant.init(
    {
        name: DataTypes.TEXT,
        favoriteColor: {
            type: DataTypes.TEXT,
            defaultValue: 'green',
        },
        age: DataTypes.INTEGER,
        cash: DataTypes.INTEGER,
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Applicant', // We need to choose the model name
    },
);

console.log('Applicant === sequelize.models.Applicant:', Applicant === sequelize.models.Applicant);
