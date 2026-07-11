import type { MantineColorsTuple } from '@mantine/core';

export type ExtendedULHubColors =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'error'
  | 'warning'
  | DefaultMantineColor;

export type ULHubColors = Record<ExtendedULHubColors, MantineColorsTuple>;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: ULHubColors;
  }
}
