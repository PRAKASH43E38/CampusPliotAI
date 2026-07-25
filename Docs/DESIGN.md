dei ---
name: CampusPilot AI Design System
colors:
  surface: '#f7f9ff'
  surface-dim: '#bedefa'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf4ff'
  surface-container: '#e1f0ff'
  surface-container-high: '#d6ebff'
  surface-container-highest: '#cbe6ff'
  on-surface: '#001e30'
  on-surface-variant: '#42474f'
  inverse-surface: '#123349'
  inverse-on-surface: '#e6f2ff'
  outline: '#737780'
  outline-variant: '#c2c6d1'
  surface-tint: '#346095'
  primary: '#002b52'
  on-primary: '#ffffff'
  primary-container: '#0a4174'
  on-primary-container: '#85aee8'
  inverse-primary: '#a3c9ff'
  secondary: '#206679'
  on-secondary: '#ffffff'
  secondary-container: '#aae9ff'
  on-secondary-container: '#266b7e'
  tertiary: '#002e39'
  on-tertiary: '#ffffff'
  tertiary-container: '#034655'
  on-tertiary-container: '#7fb3c5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e3ff'
  primary-fixed-dim: '#a3c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#16487b'
  secondary-fixed: '#b3ebff'
  secondary-fixed-dim: '#90d0e5'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5f'
  tertiary-fixed: '#b6ebfd'
  tertiary-fixed-dim: '#9acfe0'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#114d5c'
  background: '#f7f9ff'
  on-background: '#001e30'
  surface-variant: '#cbe6ff'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 40px
  container-max: 1440px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered to evoke a sense of academic prestige fused with cutting-edge artificial intelligence. It targets university administrators, faculty, and students who require a high-density information environment that feels calm, authoritative, and frictionless.

The aesthetic follows a **Premium Modern SaaS** movement. It prioritizes clarity and structural integrity over decorative elements. By utilizing a "Blue-on-Blue" layering technique instead of traditional greyscale, the interface achieves a sophisticated, cohesive atmosphere that feels proprietary to a high-end educational institution. The emotional response should be one of "effortless intelligence"—where the software feels as reliable as a century-old university but as fast as a modern startup.

## Colors
The palette abandons neutral greys in favor of a monochromatic blue spectrum to maintain brand immersion. 

- **Primary (#0A4174):** Used for critical actions, active states, and navigation branding. It represents the "Anchor" of the system.
- **Surface & Background:** The background uses a Pale Blue (#BDD8E9) to reduce eye strain compared to pure white, while surfaces utilize a brighter Sky Blue (#7BBDE8) or pure white cards to create a clear visual hierarchy.
- **Typography:** All text is rendered in deep Navy and Steel Blue tones to ensure high contrast and WCAG AA compliance while maintaining the "Prestige" feel.
- **Functional Colors:** Success states are unified with the Secondary Teal (#4E8EA2) to keep the palette tight and professional.

## Typography
The system employs a dual-font strategy. **Manrope** is used for headlines to provide a modern, geometric, and highly legible structure that feels architectural. **Hanken Grotesk** is used for body copy and labels; its slightly more organic curves ensure that long-form academic data remains approachable and easy to scan.

- **Contrast:** Headings should always use the `heading_color_hex` (#001D39) to anchor the page.
- **Hierarchy:** Use semi-bold weights for labels to distinguish them clearly from body text without needing to change colors.

## Layout & Spacing
The design system utilizes a **Fluid Grid** with a 12-column structure for desktop and a 4-column structure for mobile. 

- **Generous Whitespace:** Padding within cards and containers should never drop below 24px (stack-md + stack-sm). This "breathability" is essential to the premium feel.
- **Rhythm:** All spacing is based on a 4px baseline. Components should use `stack-md` (16px) for internal element grouping and `stack-lg` (32px) for sectioning.
- **Sidebar:** Dashboards should utilize a fixed left-hand navigation (280px) that collapses into a rail on smaller viewports.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Ambient Shadows**. This system avoids heavy black shadows, favoring deep navy tints.

- **Level 1 (Base):** Background (#BDD8E9).
- **Level 2 (Cards/Content):** White or Light Sky Blue surfaces with a 1px border (#A7C7DD).
- **Level 3 (Interactive):** Soft, diffused shadows using `rgba(10, 65, 116, 0.08)` with a 20px blur and 4px offset.
- **Level 4 (Modals):** High-diffusion shadows `rgba(10, 65, 116, 0.15)` with a 40px blur, creating a distinct "lift" from the page.

Glassmorphism is used sparingly for navigation bars, utilizing a backdrop-blur (12px) and a semi-transparent primary-white tint.

## Shapes
The shape language is purposefully **Rounded** to contrast with the formal nature of academic data. 

- **Standard Elements:** Buttons and input fields use a 12px (0.5rem) radius.
- **Containers:** Large cards, modals, and main dashboard panels use a 24px (1.5rem) radius to emphasize the "SaaS" modernism.
- **Selection States:** Pill shapes (full rounding) are reserved for Tags, Chips, and active navigation indicators.

## Components
- **Buttons:** Primary buttons use the Deep Navy (#0A4174) with white text. Secondary buttons use a Ghost style with a Primary-colored border and a subtle Sky Blue hover fill.
- **Input Fields:** Use 12px rounding, 1px border (#A7C7DD), and a Hanken Grotesk body-md font. Active states should feature a 2px Primary Blue border.
- **Cards:** White backgrounds are preferred for data-heavy cards to maximize contrast. 24px padding is mandatory. Use the Level 3 shadow on hover to indicate interactivity.
- **Chips/Badges:** Used for course categories or status. Use Secondary Teal (#4E8EA2) with 10% opacity for the background and 100% opacity for the text.
- **Lists:** Clean rows with 1px bottom borders (#A7C7DD), utilizing generous vertical padding (16px) to ensure touch-friendliness and readability.
- **Navigation:** The vertical sidebar should use the Primary color as the background, with active links highlighted via a "pill" shape and a slightly lighter blue tint.