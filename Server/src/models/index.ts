import { Sequelize } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './user.model.js';
import { Lease } from './lease.model.js';

// Initialize Sequelize instance
User.hasMany(Lease, { foreignKey: 'userId', as: 'leases' });
Lease.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Export all models and sequelize instance
export { sequelize, Sequelize, User, Lease };
