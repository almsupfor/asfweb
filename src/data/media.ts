// Artiklar om Almtuna från andra medier. Fylls på automatiskt av scripts/fetch-media.mjs (se deploy.yml).
// Bara rubrik, källa, datum och länk sparas: ingen artikeltext kopieras.
import data from './media.json';

export interface MediaItem {
  title: string;
  source: string;
  date: string; // ÅÅÅÅ-MM-DD
  url: string;
  type?: 'podd'; // saknas för vanliga artiklar
  lag?: Lag; // sätts av hämtningsskriptet utifrån artikelns ingress
}

export type Lag = 'a-lag' | 'dam' | 'j20' | 'j18';

// Gissar vilket lag en post gäller utifrån rubriken. Allt annat räknas som herrlaget (Hockeyallsvenskan). Nyckeln 'a-lag' är bara ett internt namn.
// Ordgränserna är skrivna med lookaround eftersom ordgräns-tecknet i regex inte räknar å, ä och ö som bokstäver.
// Gissar den fel? Lägg länken i LAG_OVERRIDES, den går före mönstren.
const LAG_OVERRIDES: Record<string, Lag> = {};
const DAM = /(?<![\p{L}\p{N}])dam(?:(?:lag|special|er|serien|allsvenskan|hockey)\p{L}*|(?![\p{L}\p{N}]))/iu;
const J20 = /(?<![\p{L}\p{N}])(?:[ju]20|juniorlag|juniorer)/iu;
const J18 = /(?<![\p{L}\p{N}])[ju]18/iu;
const HERR = /(?<![\p{L}\p{N}])herr/iu;
export const lagFor = (m: MediaItem): Lag => {
  const override = LAG_OVERRIDES[m.url] ?? m.lag;
  if (override) return override;
  if (J18.test(m.title)) return 'j18';
  if (J20.test(m.title)) return 'j20';
  if (DAM.test(m.title) && !HERR.test(m.title)) return 'dam';
  return 'a-lag';
};

export const media = data.items as MediaItem[];
export const mediaUpdated: string | null = data.updated;
