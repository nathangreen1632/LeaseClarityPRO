export interface AuthCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

