// Artiklar om Almtuna från andra medier. Fylls på automatiskt av scripts/fetch-media.mjs (se deploy.yml).
// Bara rubrik, källa, datum och länk sparas: ingen artikeltext kopieras.
import data from './media.json';

export interface MediaItem {
  title: string;
  source: string;
  date: string; // ÅÅÅÅ-MM-DD
  url: string;
  type?: 'podd'; // saknas för vanliga artiklar
}

export const media = data.items as MediaItem[];
export const mediaUpdated: string | null = data.updated;
