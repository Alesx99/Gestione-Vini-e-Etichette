export type UserRole = 'master' | 'operator' | 'guest';

export interface User {
  username: string;
  role: UserRole;
}
