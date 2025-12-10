import { Injectable, signal } from '@angular/core';
import { Wine } from '../models/wine.model';

const INITIAL_WINES: Wine[] = [
  {
    id: 1,
    name: 'Barolo DOCG',
    vineyard: 'Vietti',
    year: 2018,
    barcode: '8001234567890',
    provenienza: 'Piemonte, Italia',
    price: { acquisto: 35.50, ingrosso: 45.00, enoteca: 75.00 },
  },
  {
    id: 2,
    name: 'Amarone della Valpolicella Classico',
    vineyard: 'Allegrini',
    year: 2017,
    barcode: '8002345678901',
    provenienza: 'Veneto, Italia',
    price: { acquisto: 42.00, ingrosso: 55.00, enoteca: 90.00 },
  },
  {
    id: 3,
    name: 'Chianti Classico Riserva',
    vineyard: 'Castello di Brolio',
    year: 2019,
    barcode: '8003456789012',
    provenienza: 'Toscana, Italia',
    price: { acquisto: 22.80, ingrosso: 29.50, enoteca: 48.00 },
  },
  {
    id: 4,
    name: 'Vermentino di Sardegna',
    vineyard: 'Argiolas',
    year: 2022,
    barcode: '8004567890123',
    provenienza: 'Sardegna, Italia',
    price: { acquisto: 8.50, ingrosso: 11.00, enoteca: 18.50 },
  },
  {
    id: 5,
    name: 'Franciacorta Brut',
    vineyard: 'Ca\' del Bosco',
    year: 2020,
    barcode: '8005678901234',
    provenienza: 'Lombardia, Italia',
    price: { acquisto: 28.00, ingrosso: 36.00, enoteca: 55.00 },
  }
];

@Injectable({ providedIn: 'root' })
export class WineService {
  wines = signal<Wine[]>(INITIAL_WINES);

  getWineByBarcode(barcode: string): Promise<Wine | undefined> {
    return new Promise(resolve => {
        setTimeout(() => {
            const foundWine = this.wines().find(wine => wine.barcode === barcode);
            resolve(foundWine);
        }, 300);
    });
  }

  addWine(wineData: Omit<Wine, 'id'>): void {
    this.wines.update(wines => {
        const newId = wines.length > 0 ? Math.max(...wines.map(w => w.id)) + 1 : 1;
        const newWine: Wine = { id: newId, ...wineData };
        return [...wines, newWine];
    });
  }

  updateWine(updatedWine: Wine): void {
    this.wines.update(wines => 
        wines.map(wine => (wine.id === updatedWine.id ? updatedWine : wine))
    );
  }

  deleteWine(id: number): void {
    this.wines.update(wines => wines.filter(wine => wine.id !== id));
  }
}