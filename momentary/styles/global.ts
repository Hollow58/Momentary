// Shared design tokens.

// App background gradient
export const GRADIENT_COLORS = [
  'rgb(246,237,224)',
  'rgb(242,234,223)',
  'rgb(238,231,222)',
  'rgb(237,230,223)',
] as const;
export const GRADIENT_LOCATIONS = [0, 0.17, 0.60, 0.85] as const;

const MODAL_RADIUS = 36;
export const CARD_RADIUS = 24;
export const CONTROL_RADIUS = 18;
export const ICON_BUTTON_SIZE = 42;

export const TEXT_PRIMARY = '#33261F';
export const TEXT_SECONDARY = '#7C6C5B';
export const PRIMARY_ACTION = '#40312B';
export const PRIMARY_ACTION_TEXT = '#F8F2EC';
export const SURFACE_BASE = '#FAF4EE';
const SURFACE_TINT = '#F1EDE9';
export const SURFACE_BORDER = 'rgba(64, 49, 43, 0.06)';
export const CONTROL_TINT = 'rgba(64, 49, 43, 0.08)';
export const CONTROL_TINT_SOFT = 'rgba(64, 49, 43, 0.07)';

export const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};

export const pageTitle = {
  fontFamily: 'GildaDisplay_400Regular',
  fontSize: 48,
  color: '#444',
};

const sectionLabel = {
  fontFamily: 'Nunito_600SemiBold',
  fontSize: 13,
  color: '#888',
  textTransform: 'uppercase' as const,
  letterSpacing: 0.6,
};

const tabInput = {
  fontFamily: 'Nunito_400Regular',
  backgroundColor: '#FCFAF7',
  borderRadius: CONTROL_RADIUS,
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
  backgroundColor: SURFACE_BASE,
  borderTopLeftRadius: MODAL_RADIUS,
  borderTopRightRadius: MODAL_RADIUS,
};

export const modalNameplate = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  backgroundColor: SURFACE_TINT,
  borderTopLeftRadius: MODAL_RADIUS,
  borderTopRightRadius: MODAL_RADIUS,
  borderBottomLeftRadius: MODAL_RADIUS,
  borderBottomRightRadius: MODAL_RADIUS,
  paddingHorizontal: 18,
  paddingTop: 16,
  paddingBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.14,
  shadowRadius: 12,
  elevation: 20,
  zIndex: 10,
};
