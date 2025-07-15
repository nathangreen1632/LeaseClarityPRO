import jwt, {JsonWebTokenError, JwtPayload, SignOptions, TokenExpiredError} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Explicit structure for a valid JWT payload
export interface AuthJwtPayload extends JwtPayload {
  userId: number;
  email: string;
}

// Explicit error type
export interface JwtError {
  error: true;
  message: string;
  details?: unknown;
}

// Union for allowed expiresIn values
export type ExpiresInValue =
  | number
  | '30s' | '1m' | '5m' | '10m' | '15m' | '30m' | '1h' | '2h' | '6h' | '12h' | '1d' | '7d';

// Strict result types
export type JwtSignResult = string | JwtError;
export type JwtVerifyResult = AuthJwtPayload | JwtError;

export const signJwt = (
  payload: AuthJwtPayload,
  expiresIn: ExpiresInValue = '2h'
): JwtSignResult => {
  if (!JWT_SECRET) {
    return {
      error: true,
      message: 'JWT_SECRET is not set in environment variables.',
    };
  }
  try {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (err) {
    return {
      error: true,
      message: 'Failed to sign JWT.',
      details: err instanceof Error ? err.message : err,
    };
  }
};

export const verifyJwt = (token: string): JwtVerifyResult => {
  if (!JWT_SECRET) {
    return {
      error: true,
      message: 'JWT_SECRET is not set in environment variables.',
    };
  }
  if (!token) {
    return {
      error: true,
      message: 'Token not provided or invalid.',
    };
  }
  try {
    return jwt.verify(token, JWT_SECRET) as AuthJwtPayload;
  } catch (err) {
    let errorMsg = 'Failed to verify JWT. Unknown error.';
    if (err instanceof TokenExpiredError) {
      errorMsg = 'Failed to verify JWT. Token expired.';
    } else if (err instanceof JsonWebTokenError) {
      errorMsg = 'Failed to verify JWT. Invalid token.';
    }
    return {
      error: true,
      message: errorMsg,
      details: err instanceof Error ? err.message : err,
    };
  }
};

