import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class LoginComponent {
  authService = inject(AuthService);

  username = signal('');
  password = signal('');
  error = signal<string | null>(null);
  isLoading = signal(false);

  async login(event: Event) {
    event.preventDefault();
    this.isLoading.set(true);
    this.error.set(null);
    const result = await this.authService.login(this.username(), this.password());
    if (!result.success) {
      this.error.set(result.message ?? 'Errore durante il login.');
    }
    this.isLoading.set(false);
  }
}