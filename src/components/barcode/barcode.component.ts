import { Component, ChangeDetectionStrategy, input, ElementRef, AfterViewInit, viewChild, effect } from '@angular/core';

declare var JsBarcode: any;

@Component({
  selector: 'app-barcode',
  standalone: true,
  template: `<svg #barcodeElement class="w-full h-auto"></svg>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeComponent implements AfterViewInit {
  value = input.required<string>();
  barcodeElement = viewChild.required<ElementRef<SVGElement>>('barcodeElement');

  constructor() {
    effect(() => {
      // Re-render barcode if value changes
      this.generateBarcode();
    });
  }

  ngAfterViewInit(): void {
    this.generateBarcode();
  }

  private generateBarcode(): void {
    if (this.barcodeElement() && this.value()) {
      try {
        JsBarcode(this.barcodeElement().nativeElement, this.value(), {
          format: 'CODE128',
          displayValue: false,
          margin: 0,
          background: '#ffffff', // Ensure background is white for printing
          lineColor: '#000000',
        });
      } catch (e) {
        console.error('Errore durante la generazione del codice a barre:', e);
        // Potresti voler mostrare un placeholder o un messaggio di errore nell'SVG
        this.barcodeElement().nativeElement.innerHTML = `<text x="10" y="20" fill="red">Error</text>`;
      }
    }
  }
}