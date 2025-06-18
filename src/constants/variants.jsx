// Component variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  DANGER: 'danger',
  SUCCESS: 'success',
  GHOST: 'ghost',
};

export const BADGE_VARIANTS = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
  DARK: 'dark',
};

export const ICON_BUTTON_VARIANTS = {
  GHOST: 'ghost',
  PRIMARY: 'primary',
  DANGER: 'danger',
  SUCCESS: 'success',
  WARNING: 'warning',
  DARK: 'dark',
};

// Variant style mappings
export const BUTTON_VARIANT_STYLES = {
  [BUTTON_VARIANTS.PRIMARY]:
    'bg-black text-white hover:bg-gray-800 focus:ring-black',
  [BUTTON_VARIANTS.SECONDARY]:
    'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  [BUTTON_VARIANTS.OUTLINE]:
    'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500',
  [BUTTON_VARIANTS.DANGER]:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  [BUTTON_VARIANTS.SUCCESS]:
    'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  [BUTTON_VARIANTS.GHOST]: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
};

export const BADGE_VARIANT_STYLES = {
  [BADGE_VARIANTS.DEFAULT]: 'bg-gray-100 text-gray-800',
  [BADGE_VARIANTS.PRIMARY]: 'bg-blue-100 text-blue-800',
  [BADGE_VARIANTS.SUCCESS]: 'bg-green-100 text-green-800',
  [BADGE_VARIANTS.WARNING]: 'bg-yellow-100 text-yellow-800',
  [BADGE_VARIANTS.DANGER]: 'bg-red-100 text-red-800',
  [BADGE_VARIANTS.INFO]: 'bg-cyan-100 text-cyan-800',
  [BADGE_VARIANTS.DARK]: 'bg-gray-800 text-white',
};

export const ICON_BUTTON_VARIANT_STYLES = {
  [ICON_BUTTON_VARIANTS.GHOST]:
    'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
  [ICON_BUTTON_VARIANTS.PRIMARY]:
    'text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:ring-blue-500',
  [ICON_BUTTON_VARIANTS.DANGER]:
    'text-red-600 hover:text-red-800 hover:bg-red-50 focus:ring-red-500',
  [ICON_BUTTON_VARIANTS.SUCCESS]:
    'text-green-600 hover:text-green-800 hover:bg-green-50 focus:ring-green-500',
  [ICON_BUTTON_VARIANTS.WARNING]:
    'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 focus:ring-yellow-500',
};
