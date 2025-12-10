export interface WinePrice {
  acquisto: number;  // Purchase price
  ingrosso: number;  // Wholesale price
  enoteca: number;   // Retail price
}

export interface Wine {
  id: number;
  name: string;
  vineyard: string;
  year: number;
  barcode: string;
  provenienza: string;
  price: WinePrice;
}