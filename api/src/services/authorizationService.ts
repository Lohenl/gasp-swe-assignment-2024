import { HttpRequest, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import UserModel from '../models/user';

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

module.exports.checkAuthorization = async function (permission: string, request: HttpRequest, context: InvocationContext): Promise<void> {
    context.log(request);

    await sequelize.authenticate();
    UserModel(sequelize, DataTypes);
    const User = sequelize.models.User;
    await User.sync();

    const notAuthorized = false;
    if (notAuthorized) {
        throw new Error("ayio")
    }
}
