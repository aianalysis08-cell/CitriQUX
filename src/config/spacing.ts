/**
 * Uniform spacing system for homepage components
 * Maintains consistent padding and margins across all sections
 */

export const SECTION_SPACING = {
  // Vertical padding for all sections (reduced by 50%)
  paddingY: "py-12 md:py-16",
  
  // Container max width and horizontal padding
  container: "max-w-7xl mx-auto px-6",
  
  // Bottom margins for elements within sections (reduced by 50%)
  marginBottom: {
    small: "mb-3",
    medium: "mb-4", 
    large: "mb-6",
    xlarge: "mb-8",
    xxlarge: "mb-10",
  },
  
  // Grid gaps (reduced by 50%)
  gridGap: {
    small: "gap-2",
    medium: "gap-3",
    large: "gap-4",
    xlarge: "gap-6",
  }
};

export const HERO_SPACING = {
  // Hero-specific adjustments (reduced by 50%)
  titleMargin: "mb-4",
  subtitleMargin: "mb-6",
  buttonsMargin: "mb-10",
};

export const CARD_SPACING = {
  // Consistent spacing for feature/pricing cards (reduced by 50%)
  padding: "p-6",
  borderRadius: "rounded-3xl",
  marginBottom: "mb-6",
};
