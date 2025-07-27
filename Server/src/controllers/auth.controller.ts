import { Request, Response } from 'express';
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import { JwtSignResult, signJwt } from '../config/jwt.js';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '../validators/authSchemas.js';

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
): Promise<Response | void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { email, password, firstName, lastName, phoneNumber } = parsed.data;

    const existing: User | null = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already exists' });

    const passwordHash: string = await bcrypt.hash(password, 10);
    const user: User = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phoneNumber, // ✅ Sequelize maps this to `phone_number`
    });

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
        phoneNumber: user.phoneNumber, // ✅ Include in response
      },
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
): Promise<Response | void> => {
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
        phoneNumber: user.phoneNumber, // ✅ Also returned at login
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
