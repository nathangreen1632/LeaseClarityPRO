import { Request, Response } from 'express';
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Add firstName/lastName to registration schema
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
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, firstName, lastName });

    // Auto-login: issue JWT on registration
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    );

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
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    );

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
