export const theme = {
  colors: {
    // Base UI Colors
    background: '#0A0A1A',
    surface: '#14141F',
    accent: '#6366F1',
    
    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textDisabled: '#475569',
    
    // Chord Wheel Base Colors
    wheelBackground: '#0F172A',
    wheelBorder: '#1E293B',
    
    // Root Note Ring (Outermost)
    rootRingBg: '#1E293B',
    rootRingHover: '#334155',
    rootRingSelected: '#4338CA',
    rootRingDisabled: '#1E293B',
    rootText: '#F8FAFC',
    rootTextDisabled: '#475569',
    
    // Quality Ring (Middle)
    qualityRingBg: '#1A237E',
    qualityRingHover: '#283593',
    qualityRingSelected: '#3949AB',
    qualityRingDisabled: '#1A237E',
    qualityText: '#F8FAFC',
    qualityTextDisabled: '#475569',
    
    // Extension Ring (Inner)
    extensionRingBg: '#311B92',
    extensionRingHover: '#4527A0',
    extensionRingSelected: '#512DA8',
    extensionRingDisabled: '#311B92',
    extensionText: '#F8FAFC',
    extensionTextDisabled: '#475569',
    
    // Selection States
    selectionGlow: 'rgba(99, 102, 241, 0.3)',
    selectionPath: 'rgba(99, 102, 241, 0.25)',
    
    // Interactive Elements
    buttonPrimary: '#4338CA',
    buttonHover: '#4F46E5',
    buttonActive: '#3730A3',
    buttonDisabled: '#1E293B',
  },
  
  opacity: {
    hover: '0.9',
    disabled: '0.4',
    overlay: '0.8',
  },
  
  shadows: {
    ring: '0 0 20px',
    segment: '0 4px 6px rgba(0, 0, 0, 0.2)',
    button: '0 0 20px rgba(99, 102, 241, 0.2)',
  },
  
  transitions: {
    default: '200ms ease-out',
    slow: '300ms ease-in-out',
  },
  
  spacing: {
    ringGap: 45,    // Increased gap between rings
    textPadding: 15, // Increased text padding
    
    // Ring-specific spacing
    rootRing: {
      innerRadius: 195,
      outerRadius: 285
    },
    qualityRing: {
      innerRadius: 125,
      outerRadius: 215
    },
    extensionRing: {
      innerRadius: 55,
      outerRadius: 145
    }
  },
  
  fontSize: {
    xs: '0.875rem',   // 14px
    sm: '1rem',       // 16px
    base: '1.125rem', // 18px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    '2xl': '1.875rem',// 30px
    '3xl': '2.25rem', // 36px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
}
