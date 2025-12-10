import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WineService } from '../../services/wine.service';

declare var XLSX: any;

type WineFormGroup = FormGroup<{
    name: FormControl<string | null>;
    vineyard: FormControl<string | null>;
    provenienza: FormControl<string | null>;
    year: FormControl<number | null>;
    price_acquisto: FormControl<number | null>;
    price_ingrosso: FormControl<number | null>;
    price_enoteca: FormControl<number | null>;
}>

@Component({
  selector: 'app-wine-import',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wine-import.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WineImportComponent {
  close = output<void>();
  private wineService = inject(WineService);
  private fb = inject(FormBuilder);

  isProcessing = signal(false);
  error = signal<string | null>(null);
  fileName = signal<string | null>(null);

  winesToImportForm = this.fb.group({
    wines: this.fb.array<WineFormGroup>([])
  });

  get winesArray(): FormArray<WineFormGroup> {
    return this.winesToImportForm.get('wines') as FormArray<WineFormGroup>;
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    this.isProcessing.set(true);
    this.error.set(null);
    this.fileName.set(file.name);
    this.winesArray.clear();

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
            this.error.set('Il file è vuoto o non contiene dati validi.');
            this.isProcessing.set(false);
            return;
        }

        this.populateForm(json);
      } catch (err) {
        console.error(err);
        this.error.set('Errore durante la lettura del file. Assicurati che sia un file .xlsx valido.');
      } finally {
        this.isProcessing.set(false);
      }
    };
    reader.onerror = () => {
        this.error.set('Impossibile leggere il file.');
        this.isProcessing.set(false);
    };
    reader.readAsArrayBuffer(file);
  }

  private populateForm(data: any[]): void {
    data.forEach(row => {
        // Normalize keys to lowercase and without spaces for robustness
        const normalizedRow = Object.keys(row).reduce((acc, key) => {
            acc[key.toLowerCase().replace(/\s+/g, '')] = row[key];
            return acc;
        }, {} as any);

        const wineFormGroup = this.fb.group({
            name: [normalizedRow['nome'] || '', Validators.required],
            vineyard: [normalizedRow['cantina'] || '', Validators.required],
            provenienza: [normalizedRow['provenienza'] || '', Validators.required],
            year: [normalizedRow['anno'] || null, [Validators.required, Validators.min(1800)]],
            price_acquisto: [normalizedRow['prezzoacquisto'] || normalizedRow['acquisto'] || 0, [Validators.required, Validators.min(0)]],
            price_ingrosso: [normalizedRow['prezzoingrosso'] || normalizedRow['ingrosso'] || 0, [Validators.required, Validators.min(0)]],
            price_enoteca: [normalizedRow['prezzoenoteca'] || normalizedRow['enoteca'] || 0, [Validators.required, Validators.min(0)]],
        }) as WineFormGroup;
        this.winesArray.push(wineFormGroup);
    });
  }

  removeWine(index: number): void {
    this.winesArray.removeAt(index);
  }

  importWines(): void {
    if (this.winesToImportForm.invalid) {
      this.error.set('Alcuni campi non sono validi. Controlla i dati evidenziati in rosso.');
      return;
    }

    const winesToAdd = this.winesArray.value;
    winesToAdd.forEach(wine => {
        if (wine.name && wine.vineyard && wine.provenienza && wine.year) {
            this.wineService.addWine({
                name: wine.name,
                vineyard: wine.vineyard,
                provenienza: wine.provenienza,
                year: wine.year,
                barcode: `PCW-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                price: {
                    acquisto: wine.price_acquisto ?? 0,
                    ingrosso: wine.price_ingrosso ?? 0,
                    enoteca: wine.price_enoteca ?? 0,
                }
            });
        }
    });

    alert(`${winesToAdd.length} vini sono stati aggiunti con successo alla cantina!`);
    this.close.emit();
  }
}
