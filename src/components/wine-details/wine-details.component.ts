import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Wine } from '../../models/wine.model';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-wine-details',
  templateUrl: './wine-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, DecimalPipe],
})
export class WineDetailsComponent {
  wine = input.required<Wine>();
  userRole = input.required<UserRole>();

  priceInfo = computed(() => {
    const wine = this.wine();
    const role = this.userRole();
    
    switch (role) {
      case 'master':
        return { price: wine.price.acquisto, label: 'Prezzo Acquisto' };
      case 'operator':
        return { price: wine.price.ingrosso, label: 'Prezzo Ingrosso' };
      case 'guest':
      default:
        return { price: wine.price.enoteca, label: 'Prezzo Enoteca' };
    }
  });
}