// Shared design tokens — imported by page/component style files.

// App background gradient used on every screen
export const GRADIENT_COLORS = [
  'rgb(246,237,224)',
  'rgb(242,234,223)',
  'rgb(238,231,222)',
  'rgb(237,230,223)',
] as const;
export const GRADIENT_LOCATIONS = [0, 0.17, 0.60, 0.85] as const;

export const pageTitle = {
  fontFamily: 'GildaDisplay_400Regular',
  fontSize: 48,
  color: '#444',
};

export const sectionTitle = {
  fontFamily: 'Nunito_700Bold',
  fontSize: 20,
  color: '#444',
};

export const sectionCount = {
  fontFamily: 'Nunito_600SemiBold',
  color: '#888',
};

export const sectionLabel = {
  fontFamily: 'Nunito_600SemiBold',
  fontSize: 13,
  color: '#888',
  textTransform: 'uppercase' as const,
  letterSpacing: 0.6,
};

export const tabInput = {
  fontFamily: 'Nunito_400Regular',
  backgroundColor: '#FCFAF7',
  borderRadius: 18,
  paddingHorizontal: 16,
  paddingVertical: 14,
  color: '#444',
  borderWidth: 1,
  borderColor: 'rgba(64, 49, 43, 0.08)',
};

export const modalBackdrop = {
  flex: 1,
  backgroundColor: 'rgba(29, 21, 17, 0.34)',
  justifyContent: 'flex-end' as const,
};

export const modalSheetBase = {
  backgroundColor: '#FAF4EE',
  borderTopLeftRadius: 34,
  borderTopRightRadius: 34,
  borderTopWidth: 1,
  borderColor: 'rgba(64, 49, 43, 0.08)',
};
