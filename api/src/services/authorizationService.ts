import { HttpRequest, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import PermissionModel from "../models/permission";
import PermissionAssignmentModel from "../models/permissionassignment";
// import UserModel from '../models/user';

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

module.exports.checkAuthorization = async function (request: HttpRequest, context: InvocationContext, scopeId: number, roleId: number[]): Promise<void> {
    context.log(request);
    context.log('scopeId', scopeId);
    context.log('roleId', roleId);

    // only for development + demo
    if (process.env['ENABLE_AUTHORIZATION'] === 'false') return;

    // TODO: needs permissionAssignment CRUD
    // Then just use permissionAssignment to grab values

    await sequelize.authenticate();
    PermissionModel(sequelize, DataTypes);
    PermissionAssignmentModel(sequelize, DataTypes);
    const Permission = sequelize.models.Permission;
    const PermissionAssignment = sequelize.models.PermissionAssignment;
    const syncPromises = [];
    syncPromises.push(Permission.sync());
    syncPromises.push(PermissionAssignment.sync());
    await Promise.allSettled(syncPromises);

    const notAuthorized = false;
    if (notAuthorized) throw new Error('unauthorized user');
}
