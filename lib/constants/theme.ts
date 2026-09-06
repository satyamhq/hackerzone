/**
 * B&W design system tokens per §6.1.
 * Reference these programmatically when CSS classes aren't sufficient.
 */
export const THEME = {
  colors: {
    deepBlack: "#0A0A0A",
    charcoal: "#1A1A1A",
    nearBlack: "#141414",
    cardSurface: "#161616",
    white: "#FFFFFF",
    offWhite: "#F5F5F5",
    lightGray: "#A3A3A3",
    borderGray: "#3F3F3F",
    darkText: "#111111",
  },
  gradient: {
    charcoal: "#1A1A1A, #4A4A4A, #0A0A0A",
  },
} as const;
