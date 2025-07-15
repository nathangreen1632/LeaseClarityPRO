import {User} from '../models/index.js';
import bcrypt from 'bcrypt';

export interface AuthServiceError {
  error: true;
  message: string;
  details?: unknown;
}

// Find user by email, returns User or null or error object
export const findUserByEmail = async (
  email: string
): Promise<User | null | AuthServiceError> => {
  try {
    return await User.findOne({where: {email}});
  } catch (err) {
    return {
      error: true,
      message: 'Failed to query user by email.',
      details: err instanceof Error ? err.message : err,
    };
  }
};

// Create user, returns User or error object
export const createUser = async (
  email: string,
  password: string
): Promise<User | AuthServiceError> => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return await User.create({email, passwordHash});
  } catch (err) {
    return {
      error: true,
      message: 'Failed to create user.',
      details: err instanceof Error ? err.message : err,
    };
  }
};

// Validate password, returns true (match), false (no match), or error object
export const validatePassword = async (
  user: User,
  password: string
): Promise<boolean | AuthServiceError> => {
  try {
    return await bcrypt.compare(password, user.passwordHash);
  } catch (err) {
    return {
      error: true,
      message: 'Failed to validate password.',
      details: err instanceof Error ? err.message : err,
    };
  }
};
