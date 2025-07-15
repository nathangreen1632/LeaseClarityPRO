import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

// TypeScript interfaces
export interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Class for typing — DO NOT declare class fields!
export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  // Only declare these for type-checking, not as class fields!
  // Remove all lines like "public id!: number;".
  // The following line is a type-only annotation, does NOT emit runtime property:
  declare id: number;
  declare email: string;
  declare passwordHash: string;
  declare firstName?: string;
  declare lastName?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);
