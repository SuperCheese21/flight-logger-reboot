import { BadgeProps } from 'react-daisyui';

export const BADGE_COLORS_MAP: Record<string, BadgeProps['color']> = {
  BASIC: 'primary',
  ECONOMY: 'primary',
  PREMIUM: 'secondary',
  BUSINESS: 'accent',
  FIRST: 'accent',
};

export const CLASS_TEXT_MAP: Record<string, string> = {
  BASIC: 'Economy',
  ECONOMY: 'Economy',
  PREMIUM: 'Economy+',
  BUSINESS: 'Business',
  FIRST: 'First',
};
