/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#162B2B',
    tint: '#167A72',
    background: '#FBFCFB',
    foreground: '#162B2B',
    card: '#FFFEFA',
    cardForeground: '#162B2B',
    primary: '#167A72',
    primaryForeground: '#F5FFFB',
    secondary: '#EAF5F1',
    secondaryForeground: '#4B6863',
    muted: '#F2F5F3',
    mutedForeground: '#73827F',
    accent: '#D7EEE7',
    accentForeground: '#12675F',
    destructive: '#C85D55',
    destructiveForeground: '#FFF9F4',
    border: '#E1EAE6',
    input: '#E7EFEB',
    success: '#268A78',
    warning: '#C9893E',
    softLime: '#F7E8B0',
    ink: '#142424',
    blue: '#DFECF6',
    teal: '#167A72',
    mint: '#D9F0E8',
    paper: '#FFFDF8',
    paperLine: '#E7DFD2',
    coral: '#F0E4D8',
    lavender: '#E8E4F2',
    gold: '#E6B84E',
    scanBackground: '#111D1D',
    scannerStage: '#6D4E3C',
    scannerPanel: '#1A2423',
    scannerControl: '#253331',
  },
  dark: {
    text: '#E9F4ED',
    tint: '#8CD7C0',
    background: '#102321',
    foreground: '#E9F4ED',
    card: '#18302D',
    cardForeground: '#E9F4ED',
    primary: '#8CD7C0',
    primaryForeground: '#102321',
    secondary: '#23433E',
    secondaryForeground: '#C5E5D8',
    muted: '#1D3834',
    mutedForeground: '#97B8AD',
    accent: '#2D6358',
    accentForeground: '#D8F1E4',
    destructive: '#E8897D',
    destructiveForeground: '#FFF9F4',
    border: '#31514A',
    input: '#29473F',
    success: '#75D2B8',
    warning: '#EBC27C',
    softLime: '#D7EB9A',
    ink: '#E9F4ED',
    blue: '#A9D7E1',
    teal: '#8CD7C0',
    mint: '#2F6559',
    paper: '#F6F0DE',
    paperLine: '#D4C8B0',
    coral: '#C87E6C',
    lavender: '#6B6389',
    gold: '#D6B052',
    scanBackground: '#0B1716',
    scannerStage: '#5A4134',
    scannerPanel: '#162624',
    scannerControl: '#24413B',
  },
  radius: 18,
};

export default colors;
