export interface ColorInfo {
  hex: string;
  name: string;
}

export type ColorKey = string;
export type PieceType = "shirt" | "pants" | "shoe";
export type PatternPieceType = "shirt" | "pants";

export interface ComboItem {
  k: ColorKey;
  note: string;
}

export interface ShirtCombo {
  pants?: ComboItem[];
  shoes?: ComboItem[];
}

export interface PantsCombo {
  shirts?: ComboItem[];
  shoes?: ComboItem[];
}

export interface ShoeCombo {
  shirts?: ComboItem[];
  pants?: ComboItem[];
}

export type PieceCombo = ShirtCombo | PantsCombo | ShoeCombo;

export interface LookPiece {
  role: PieceType;
  ck: ColorKey;
}

export interface FullLookPiece {
  role: string;
  hex: string;
  name: string;
}

export interface PatternCombo {
  name: string;
  colors: string[];
  look: LookPiece[];
  note: string;
}

export interface PatternType {
  id: string;
  name: string;
}

export interface SwapEntry {
  bad: string;
  badColors: string[];
  good: string;
  goodColors: string[];
  pattern: string;
}

export type PatternDrawType =
  | "stripes"
  | "stripes-h"
  | "check"
  | "herringbone"
  | "houndstooth"
  | "windowpane"
  | "polka"
  | "floral"
  | "camo"
  | "linen"
  | "tie-dye";
