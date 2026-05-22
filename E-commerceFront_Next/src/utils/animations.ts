import { Variants } from 'framer-motion';

/**
 * Optimized animation configurations
 * These presets reduce layout thrashing and use performant properties
 */

// Filter section animations - uses scaleY instead of height for better performance
export const filterSectionVariants: Variants = {
  closed: {
    scaleY: 0,
    opacity: 0,
    transformOrigin: '0% 0%',
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
  open: {
    scaleY: 1,
    opacity: 1,
    transformOrigin: '0% 0%',
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
  exit: {
    scaleY: 0,
    opacity: 0,
    transformOrigin: '0% 0%',
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
};

// Chevron rotate animation - optimized
export const chevronVariants: Variants = {
  closed: { rotate: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
  open: { rotate: 180, transition: { duration: 0.2, ease: 'easeInOut' } },
};

// Dropdown animations - simplified for performance
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15, ease: 'easeInOut' },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15, ease: 'easeInOut' },
  },
};

// Badge spring animation - simplified (reduced stiffness from 300 to 150)
export const badgeVariants: Variants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 150, damping: 20, duration: 0.3 },
  },
  exit: { scale: 0.5, opacity: 0, transition: { duration: 0.15 } },
};

// Modal animations - for logout confirmation
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
};

// Hamburger menu animations - optimized
export const hamburgerVariants = {
  top: {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 7 },
  },
  middle: {
    closed: { opacity: 1, scaleX: 1 },
    open: { opacity: 0, scaleX: 0 },
  },
  bottom: {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -6 },
  },
};

export const hamburgerLineTransition = { duration: 0.3, ease: [0.65, 0, 0.35, 1] };

/**
 * Get animation based on motion preference
 * If user prefers reduced motion, returns no animation
 */
export const getMotionPreference = (
  prefersReducedMotion: boolean,
  animation: Variants
): Variants => {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0 } },
      exit: { opacity: 0, transition: { duration: 0 } },
    };
  }
  return animation;
};
