---
name: Alpine Focus
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e7f2'
  surface-container-highest: '#e1e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f9f9ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ec'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 2.5rem
  stack-gap: 1.5rem
  item-gap: 0.75rem
  margin-mobile: 1rem
  margin-desktop: auto
---

## Brand & Style

The design system centers on a "Focus over Landscape" narrative. It targets high-productivity individuals who seek mental clarity through organization. The aesthetic is a refined blend of **Minimalism** and **Glassmorphism**, placing clean, high-contrast functional containers atop a deep, atmospheric background.

The emotional response is one of calm and control. By utilizing a dark mountain backdrop contrasted with a stark white foreground, the UI creates a focal point that "floats" in space, reducing peripheral distraction and emphasizing the current task.

## Colors

This design system utilizes a high-contrast relationship between the environment and the workspace. 

- **Primary Blue (#3b82f6):** Reserved exclusively for high-intent actions, progress indicators, and active states.
- **Surface White (#ffffff):** Used for the main application container to provide a clean, paper-like canvas for tasks.
- **Slate Palette:** A range of slate grays are used for content hierarchy. 
    - `Slate-900` (#0f172a) for primary headings.
    - `Slate-600` (#475569) for body text.
    - `Slate-400` (#94a3b8) for meta-information and placeholders.
- **The Overlay:** A semi-transparent dark navy/slate wash is applied over the background image to ensure the white surface maintains a 7:1 contrast ratio for maximum legibility.

## Typography

The system uses **Inter** for its systematic, utilitarian clarity. The type scale is generous to support the "airy" feel.

- **Headlines:** Use a tighter letter-spacing and heavier weights to anchor the page.
- **Body:** Standard weight with increased line-height (1.5–1.6) to prevent text-heavy task lists from feeling cluttered.
- **Labels:** Used for tags and metadata, slightly tracked out for distinctness at small sizes.

## Layout & Spacing

The layout follows a **Fixed Grid** approach for the primary task container, centered horizontally on the screen to maintain focus.

- **Desktop:** The main card is constrained to a max-width of 768px.
- **Padding:** We use a generous 40px (2.5rem) internal padding for the main container to create an "airy" breathing room.
- **Gaps:** Vertical spacing between task items is consistent at 12px (0.75rem) to ensure touch targets are accessible and the list remains scannable.
- **Mobile:** The container stretches to fill the screen width with a 16px (1rem) margin on either side.

## Elevation & Depth

Hierarchy is achieved through a combination of backdrop filters and soft ambient shadows.

- **The Main Stage:** The primary white card uses a large, ultra-soft shadow (`0 20px 50px rgba(0,0,0,0.1)`) to lift it off the darkened mountain background.
- **Task Items:** On hover, individual list items should transition from a flat state to a very subtle "raised" state using a low-opacity border (Slate-100) rather than a shadow, keeping the UI clean.
- **Modals:** Use a heavy backdrop blur (20px) on the background overlay to isolate the user's attention.

## Shapes

The shape language is modern and friendly. 
- **Main Container:** Uses `rounded-xl` (1.5rem / 24px) to soften the large surface area.
- **Interactive Elements:** Buttons and input fields use `rounded-lg` (1rem / 16px) to match the container’s aesthetic.
- **Selection Indicators:** Checkboxes use a slightly smaller radius (4px) to maintain a crisp, functional appearance within the softer layout.

## Components

- **Buttons:** Primary buttons are solid Blue (#3b82f6) with white text. They use 1rem rounded corners. Secondary buttons are Slate-100 with Slate-900 text.
- **Task Cards:** High-contrast White background. Use a thin Slate-100 bottom border for separation instead of heavy boxes.
- **Input Fields:** Large, airy fields with 1rem padding. The focus state uses a 2px Blue border with a soft blue outer glow.
- **Checkboxes:** Custom-styled circles or highly rounded squares. When checked, they fill with the Primary Blue and trigger a strikethrough on the associated task text (Slate-400).
- **Chips/Tags:** Used for categories (e.g., "Work", "Personal"). These should be low-contrast (Slate-100 background) with `label-sm` typography to remain secondary to the task title.
- **Progress Bar:** A thin (4px) line at the top of the white container showing the percentage of completed tasks in Primary Blue.