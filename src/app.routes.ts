import { Routes } from '@angular/router';
import { WineScannerComponent } from './components/wine-scanner/wine-scanner.component';
import { WineManagementComponent } from './components/wine-management/wine-management.component';

export const routes: Routes = [
  { path: '', component: WineScannerComponent, title: 'Privilege Cafè - Scanner' },
  { path: 'management', component: WineManagementComponent, title: 'Privilege Cafè - Gestione Cantina' },
];
