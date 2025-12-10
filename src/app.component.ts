import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, LoginComponent, RouterOutlet]
})
export class AppComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  
  logout() {
    this.authService.logout();
  }
}