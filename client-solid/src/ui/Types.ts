//export type ThemeGlobals = { [key in ThemeGlobalsKey]: string };
//export type ThemePalettesValue = { [key2 in ThemePalettePropKey]?: string };
//export type ThemePalettes = { [key1 in ThemePaletteKey]: ThemePalettesValue };

export type ThemeStoreValue = "light" | "dark" | "system";
export type SystemThemeValue = "light" | "dark";

export type ButtonVariant =
  | "gradient"
  | "color"
  | "light"
  | "outline"
  | "subtle"
  | "fill"
  | "white"
  | "unstyle"
  | "border"
  | "dim";

export type InputVariant =
  | "border"
  | "fade"
  | "dim"
  | "transparent"
  | "unstyle";

export type CheckboxVariant =
  | "color"
  | "light"
  | "outline"
  | "fill"
  | "unstyle"
  | "dim";

export type SizeType = "xs" | "sm" | "md" | "lg" | "xl";

export type FillVariant =
  | "white"
  | "color"
  | "dim"
  | "fill"
  | "gradient"
  | "valid"
  | "invalid";

export type AnchorVariant = "white" | "color" | "gradient";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type PositionVariant = "start" | "center" | "end";
export type PositionCoord = { x: PositionVariant; y: PositionVariant };
export type PositionTopLeft = { top: number; left: number };
