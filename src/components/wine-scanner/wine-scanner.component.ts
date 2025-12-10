import { Component, ChangeDetectionStrategy, inject, signal, ElementRef, viewChild, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WineService } from '../../services/wine.service';
import { AuthService } from '../../services/auth.service';
import { Wine } from '../../models/wine.model';
import { WineDetailsComponent } from '../wine-details/wine-details.component';
import { WineLabelComponent } from '../wine-label/wine-label.component';

@Component({
  selector: 'app-wine-scanner',
  templateUrl: './wine-scanner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, WineDetailsComponent, WineLabelComponent, RouterLink],
})
export class WineScannerComponent implements OnDestroy {
  wineService = inject(WineService);
  authService = inject(AuthService);

  barcode = signal('');
  scannedWine = signal<Wine | null>(null);
  error = signal<string | null>(null);
  isLoading = signal(false);
  showLabel = signal(false);
  
  isScanning = signal(false);
  videoElement = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
  
  private codeReader: any;

  currentUser = this.authService.currentUser;

  constructor() {
    effect(() => {
      if (this.isScanning() && this.videoElement()) {
        this.startCameraScan();
      } else {
        this.stopCameraScan();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCameraScan();
  }

  toggleScan(): void {
    this.isScanning.update(v => !v);
  }

  private startCameraScan(): void {
    if (!this.videoElement()) return;

    // Access ZXing from the window object, where it's placed by the script tag.
    const ZXing = (window as any).ZXing;

    if (!ZXing) {
      console.error('Libreria di scansione ZXing non trovata.');
      this.error.set('Impossibile caricare la funzionalità di scansione. Riprova a ricaricare la pagina.');
      this.isScanning.set(false);
      return;
    }

    this.codeReader = new ZXing.BrowserBarcodeReader();
    this.codeReader.decodeFromVideoDevice(undefined, this.videoElement()!.nativeElement, (result: any, err: any) => {
      if (result) {
        this.barcode.set(result.getText());
        this.isScanning.set(false);
        this.findWine();
      }
      if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error('Errore di scansione:', err);
        this.error.set('Errore durante la scansione. Assicurati di aver dato i permessi per la fotocamera.');
        this.isScanning.set(false);
      }
    }).catch((err: any) => {
      console.error('Errore avvio fotocamera:', err);
      this.error.set('Impossibile avviare la fotocamera. Controlla i permessi del browser.');
      this.isScanning.set(false);
    });
  }

  private stopCameraScan(): void {
    if (this.codeReader) {
      this.codeReader.reset();
      this.codeReader = null;
    }
  }

  async findWine() {
    if (!this.barcode()) return;
    this.isLoading.set(true);
    this.error.set(null);
    this.scannedWine.set(null);
    this.showLabel.set(false);
    
    const wine = await this.wineService.getWineByBarcode(this.barcode());
    if (wine) {
      this.scannedWine.set(wine);
    } else {
      this.error.set('Nessun vino trovato con questo codice a barre.');
    }
    this.isLoading.set(false);
  }
  
  clearSearch() {
      this.barcode.set('');
      this.scannedWine.set(null);
      this.error.set(null);
      this.showLabel.set(false);
  }
}