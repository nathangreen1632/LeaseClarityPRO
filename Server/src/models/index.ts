import { Sequelize } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './user.model.js';
import { Lease } from './lease.model.js';

User.hasMany(Lease, { foreignKey: 'userId', as: 'leases' });
Lease.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, Sequelize, User, Lease };
