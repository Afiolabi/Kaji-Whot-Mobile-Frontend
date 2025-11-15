export type CardShape = 'circle' | 'triangle' | 'cross' | 'square' | 'star' | 'whot';
export type CardNumber = 1 | 2 | 3 | 4 | 5 | 7 | 8 | 10 | 11 | 12 | 13 | 14 | 20;

export interface Card {
  id: string;
  shape: CardShape;
  number?: CardNumber;
  isSpecial?: boolean;
  imageUrl?: string;
}

export interface PlayedCard extends Card {
  playedBy: string;
  playedAt: number;
}
