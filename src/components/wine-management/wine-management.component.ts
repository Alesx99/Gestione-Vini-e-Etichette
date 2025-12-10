import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WineService } from '../../services/wine.service';
import { AuthService } from '../../services/auth.service';
import { Wine } from '../../models/wine.model';
import { WineLabelComponent } from '../wine-label/wine-label.component';
import { WineImportComponent } from '../wine-import/wine-import.component';


@Component({
  selector: 'app-wine-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, WineLabelComponent, WineImportComponent, RouterLink],
  templateUrl: './wine-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WineManagementComponent {
  wineService = inject(WineService);
  authService = inject(AuthService);
  // FIX: Explicitly type FormBuilder to resolve type inference issue with inject().
  private fb: FormBuilder = inject(FormBuilder);

  currentUser = this.authService.currentUser;
  wines = this.wineService.wines;
  isModalOpen = signal(false);
  editingWine = signal<Wine | null>(null);
  wineToPrint = signal<Wine | null>(null);
  showImport = signal(false);

  wineForm = this.fb.group({
    name: ['', Validators.required],
    vineyard: ['', Validators.required],
    provenienza: ['', Validators.required],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear() + 1)]],
    barcode: [{value: '', disabled: true}, Validators.required],
    price: this.fb.group({
      acquisto: [0, [Validators.required, Validators.min(0)]],
      ingrosso: [0, [Validators.required, Validators.min(0)]],
      enoteca: [0, [Validators.required, Validators.min(0)]],
    })
  });

  openAddModal(): void {
    this.editingWine.set(null);
    const newBarcode = `PCW-${Date.now()}`;
    this.wineForm.reset({ 
        year: new Date().getFullYear(), 
        price: { acquisto: 0, ingrosso: 0, enoteca: 0 },
        barcode: newBarcode,
        name: '',
        vineyard: '',
        provenienza: ''
    });
    this.isModalOpen.set(true);
  }

  openEditModal(wine: Wine): void {
    this.editingWine.set(wine);
    this.wineForm.patchValue(wine);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    if (this.wineForm.dirty && !confirm('Hai delle modifiche non salvate. Sei sicuro di volerle scartare?')) {
      return; // L'utente ha annullato la chiusura
    }
    this.isModalOpen.set(false);
  }

  openPrintModal(wine: Wine): void {
    this.wineToPrint.set(wine);
  }
  
  closePrintModal(): void {
    this.wineToPrint.set(null);
  }

  saveWine(): void {
    if (this.wineForm.invalid) {
      return;
    }

    const formValue = this.wineForm.getRawValue();
    const wineData = {
        name: formValue.name!,
        vineyard: formValue.vineyard!,
        provenienza: formValue.provenienza!,
        year: formValue.year!,
        barcode: formValue.barcode!,
        price: {
            acquisto: formValue.price!.acquisto!,
            ingrosso: formValue.price!.ingrosso!,
            enoteca: formValue.price!.enoteca!
        }
    };

    const currentWine = this.editingWine();
    if (currentWine) {
      this.wineService.updateWine({ ...currentWine, ...wineData });
    } else {
      this.wineService.addWine(wineData);
    }

    this.isModalOpen.set(false);
  }

  confirmDelete(wine: Wine): void {
    if (confirm(`Sei sicuro di voler eliminare il vino "${wine.name}"? L'azione è irreversibile.`)) {
      this.wineService.deleteWine(wine.id);
    }
  }
}
