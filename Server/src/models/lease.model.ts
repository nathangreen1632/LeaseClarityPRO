import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './user.model.js';

export interface LeaseAttributes {
  id: number;
  filePath: string;
  originalFileName: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface LeaseCreationAttributes extends Optional<LeaseAttributes, 'id'> {}

export class Lease extends Model<LeaseAttributes, LeaseCreationAttributes> {}

Lease.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalFileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Lease',
    tableName: 'leases',
    timestamps: true,
  }
);

export interface Lease extends LeaseAttributes {}

User.hasMany(Lease, { foreignKey: 'userId' });
Lease.belongsTo(User, { foreignKey: 'userId' });
