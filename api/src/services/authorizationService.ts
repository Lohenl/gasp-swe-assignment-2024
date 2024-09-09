import { HttpRequest, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import * as _ from "lodash";
import PermissionAssignmentModel from "../models/permissionassignment";
import PermissionModel from "../models/permission";
import UserModel from "../models/user";

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

module.exports.checkAuthorization = async function (request: HttpRequest, context: InvocationContext, PermissionScopeId: number, AdminRoleIds: number[]): Promise<void> {
    const authz_user_id = request.headers.get('authz_user_id');
    // only for development + demo
    if (process.env['ENABLE_AUTHORIZATION'] === 'false' || !authz_user_id) {
        context.log('skipping authorization');
        return;
    }

    context.log("authz_user_id", authz_user_id)
    context.log('scopeId', PermissionScopeId);
    context.log('roleIds', AdminRoleIds);

    // Then just use permissionAssignment to grab values
    await sequelize.authenticate();
    PermissionModel(sequelize, DataTypes);
    UserModel(sequelize, DataTypes);
    PermissionAssignmentModel(sequelize, DataTypes);
    const Permission = sequelize.models.Permission;
    const User = sequelize.models.User;
    const PermissionAssignment = sequelize.models.PermissionAssignment;

    // declare M:M relationships - Permission is essentially a junction table
    // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
    Permission.belongsToMany(User, { through: PermissionAssignment });
    User.belongsToMany(Permission, { through: PermissionAssignment });
    // wait for all model syncs to finish
    const syncPromises = [];
    syncPromises.push(Permission.sync());
    syncPromises.push(User.sync());
    syncPromises.push(PermissionAssignment.sync());
    await Promise.allSettled(syncPromises);

    // pull all permissions assigned to user
    // too tired to figure why eager loading isnt working lol
    const _userAssignments = await PermissionAssignment.findAll({
        where: { UserId: authz_user_id }
    })
    const userAssignments = [];
    const permissions = [];
    const promises = [];
    _userAssignments.forEach(assignment => {
        userAssignments.push(assignment.dataValues);
        promises.push(Permission.findByPk(assignment.dataValues.PermissionId))
    });
    const results = await Promise.allSettled(promises);
    (results as any[]).forEach(result => {
        permissions.push(result.value.dataValues);
    })
    // context.log('userAssignments:', userAssignments);
    // context.log('results', results);
    context.log('permissions', permissions);

    // construct the combinations of permissions needed
    const combinations = [];
    AdminRoleIds.forEach(AdminRoleId => {
        combinations.push({ PermissionScopeId, AdminRoleId });
    })
    // context.log('combinations', combinations);

    // loop through combinations and permissions
    let matches = 0;
    combinations.forEach(combo => {
        // context.log('combo', combo);
        const found = _.find(permissions, combo);
        // context.log('found', found);
        if (found) matches += 1;
    })

    // if there is no match, the user is not authorized
    if (matches == 0) throw new Error('unauthorized user');
}
