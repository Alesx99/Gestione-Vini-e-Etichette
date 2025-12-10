import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Wine } from '../../models/wine.model';
import { BarcodeComponent } from '../barcode/barcode.component';

@Component({
  selector: 'app-wine-label',
  templateUrl: './wine-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, DecimalPipe, BarcodeComponent],
})
export class WineLabelComponent {
  wine = input.required<Wine>();

  print(): void {
    window.print();
  }
}