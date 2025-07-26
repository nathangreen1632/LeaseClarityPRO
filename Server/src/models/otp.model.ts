import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export class Otp extends Model {
  public id!: number;
  public email!: string;
  public otpHash!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Otp.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    otpHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'otp_hash',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
  },
  {
    sequelize,
    modelName: 'Otp',
    tableName: 'email_otp_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
