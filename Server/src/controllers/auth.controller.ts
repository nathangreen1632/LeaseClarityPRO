import { Request, Response } from 'express';
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import {JwtSignResult, signJwt} from '../config/jwt.js'; // <-- Use your jwt helper

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { email, password, firstName, lastName } = parsed.data;
    const existing: User | null = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already exists' });
    const passwordHash: string = await bcrypt.hash(password, 10);
    const user: User = await User.create({ email, passwordHash, firstName, lastName });

    const token: JwtSignResult = signJwt({ userId: user.id, email: user.email }, '6h');
    if (typeof token !== 'string') {
      return res.status(500).json({ error: token.message });
    }

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;
    const user: User | null = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid: boolean = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token: JwtSignResult = signJwt({ userId: user.id, email: user.email }, '6h');
    if (typeof token !== 'string') {
      return res.status(500).json({ error: token.message });
    }

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
