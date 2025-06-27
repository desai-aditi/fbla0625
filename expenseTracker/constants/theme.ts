import { scale, verticalScale } from "@/utils/styling";

export const colors = {
  // Primary brand colors - keeping your green theme
  primary: "#2d5a3d",           // Deeper, more sophisticated green
  primaryLight: "#40916c",      // Medium green for accents
  primaryDark: "#1a3d2b",       // Dark green for depth
  primarySoft: "#52c788",       // Soft green for highlights
  
  // Text colors - updated for light theme
  text: "#1e293b",              // Primary text (dark for light backgrounds)
  textSecondary: "#475569",     // Secondary text
  textMuted: "#64748b",         // Muted text
  textLight: "#f8fafc",         // Light text for dark backgrounds
  
  // Status colors
  success: "#22c55e",           // Success green
  error: "#ef4444",             // Error red
  warning: "#f59e0b",           // Warning amber
  info: "#3b82f6",              // Info blue
  
  // Neutral palette
  white: "#ffffff",
  black: "#000000",
  
  // Gray scale - for light theme
  neutral50: "#f8fafc",
  neutral100: "#f1f5f9",
  neutral200: "#e2e8f0",
  neutral300: "#cbd5e1",
  neutral400: "#94a3b8",
  neutral500: "#64748b",
  neutral600: "#475569",
  neutral700: "#334155",
  neutral800: "#1e293b",
  neutral900: "#0f172a",
  
  // Background colors for light theme
  bg: "#ffffff",                // Main background
  surfaceBg: "#f8fafc",         // Surface background
  cardBg: "#ffffff",            // Card background
  cardBgSecondary: "#f1f5f9",   // Secondary card background
  inputBg: "#f8fafc",           // Input background
  modalBg: "#ffffff",           // Modal background
  
  // Accent colors
  accent: "#f59e0b",            // Gold accent
  accentSoft: "#fbbf24",        // Soft gold
  
  // Legacy colors for compatibility
  rose: "#ef4444",
  green: "#22c55e",
  primary500: "#2d5a3d",
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _8: scale(8),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _16: scale(16),
  _20: scale(20),
  _24: scale(24),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _8: verticalScale(8),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _16: verticalScale(16),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _24: verticalScale(24),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _8: verticalScale(8),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _16: verticalScale(16),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _24: verticalScale(24),
  _30: verticalScale(30),
};

// Shadow presets for consistent elevation - adjusted for light theme
export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};