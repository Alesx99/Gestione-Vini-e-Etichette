import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);

  // Mock user database
  private users: Record<string, { password: string; role: UserRole }> = {
    'master': { password: 'masterpass', role: 'master' },
    'operatore': { password: 'operatorpass', role: 'operator' },
    'guest': { password: 'guestpass', role: 'guest' }
  };

  login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = this.users[username.toLowerCase()];
        if (user && user.password === password) {
          this.currentUser.set({ username: username, role: user.role });
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'Credenziali non valide.' });
        }
      }, 500);
    });
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
