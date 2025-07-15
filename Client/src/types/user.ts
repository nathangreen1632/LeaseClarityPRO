export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  // Add more fields as needed (e.g. roles, avatar, phone)
  createdAt?: string;
  updatedAt?: string;
}
