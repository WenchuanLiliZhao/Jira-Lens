# SwiperCarousel Component - Design Specification

This document defines the design specifications for the SwiperCarousel component.

---

## Design Tokens

### Colors

All colors use design tokens from `@/global-styles/colors.ts`. **Never use hardcoded hex values.**

#### Navigation Buttons
- **Default Background**: `var(--use-bg-tool-bg)` (`--chart-black-alpha-15-hex`)
- **Default Icon Color**: `var(--use-icon-prime)` (`--chart-black-alpha-70-hex`)
- **Hover Background**: `var(--use-hover-box-hover)` (`--chart-black-alpha-4`)
- **Hover Icon Color**: `var(--use-icon-emph)` (`--chart-black-alpha-100`)
- **Active Background**: `var(--use-hover-box-mouse-down)` (`--chart-black-alpha-6`)
- **Disabled Opacity**: `0.35`

#### Pagination
- **Bullet Background**: `var(--use-icon-prime)` (`--chart-black-alpha-70-hex`)
- **Bullet Opacity (Inactive)**: `0.4`
- **Bullet Opacity (Hover)**: `0.6`
- **Bullet Opacity (Active)**: `1.0`
- **Active Bullet Background**: `var(--use-icon-emph)` (`--chart-black-alpha-100`)
- **Fraction Text Color**: `var(--use-text-prime)` (`--chart-black-alpha-90-hex`)
- **Progressbar Background**: `var(--use-bg-secondary)` (`--chart-black-alpha-2-hex`)
- **Progressbar Fill**: `var(--use-icon-emph)` (`--chart-black-alpha-100`)

### Spacing

- **Navigation Button Size**: `40px × 40px`
- **Navigation Button Position (Horizontal)**: `10px` from left/right edges
- **Navigation Button Position (Vertical)**: `10px` from top/bottom, centered horizontally
- **Pagination Position (Horizontal)**: `10px` from bottom, centered horizontally
- **Pagination Position (Vertical)**: `10px` from right, centered vertically
- **Pagination Bullet Size**: `8px × 8px` (inactive), `24px × 8px` (active horizontal), `8px × 24px` (active vertical)
- **Pagination Bullet Gap**: `4px`
- **Progressbar Height (Horizontal)**: `4px`
- **Progressbar Width (Vertical)**: `4px`

### Typography

- **Pagination Fraction Font Size**: `14px`
- **Pagination Fraction Line Height**: `1.5`
- **Navigation Icon Font Size**: `16px`
- **Navigation Icon Font Weight**: `bold`

### Effects

- **Transition Duration**: `0.2s`
- **Transition Timing**: `ease`
- **Border Radius (Navigation)**: `50%` (circular)
- **Border Radius (Pagination Bullet)**: `50%` (inactive), `4px` (active)

---

## Visual Variants

### Direction

#### Horizontal (`direction="horizontal"`)
- Slides move left/right
- Navigation buttons positioned on left/right sides
- Pagination positioned at bottom center
- Default direction

#### Vertical (`direction="vertical"`)
- Slides move up/down
- Navigation buttons positioned at top/bottom, rotated 90 degrees
- Pagination positioned on right side, vertically centered
- Bullets arranged vertically

### Pagination Types

#### Bullets (`type="bullets"`)
- Default pagination type
- Circular dots indicating slide position
- Active bullet expands horizontally (horizontal) or vertically (vertical)
- Clickable by default

#### Fraction (`type="fraction"`)
- Shows current/total slides (e.g., "1 / 5")
- Horizontal: Normal text alignment
- Vertical: Vertical text orientation using `writing-mode: vertical-lr`

#### Progressbar (`type="progressbar"`)
- Progress bar showing slide position
- Horizontal: Bar at bottom, fills left to right
- Vertical: Bar on right side, fills top to bottom

---

## Component Structure

### SwiperCarousel (Main Component)
- **Container**: `.swiper-carousel`
  - `position: relative`
  - `width: 100%`
  - `overflow: visible` (allows pagination to be visible)

- **Swiper Container**: `.swiper-container`
  - `position: relative` (for pagination positioning)
  - `width: 100%`
  - `height: 100%`

- **Slides**: `.swiper-slide`
  - `display: flex`
  - `justify-content: center`
  - `align-items: center`

### SwiperPagination (Sub-component)
- **Wrapper**: `.swiper-pagination-wrapper`
  - `position: absolute`
  - `z-index: 10`

- **Horizontal Wrapper**: `.swiper-pagination-wrapper-horizontal`
  - `bottom: 10px`
  - `left: 50%`
  - `transform: translateX(-50%)`

- **Vertical Wrapper**: `.swiper-pagination-wrapper-vertical`
  - `right: 10px`
  - `top: 50%`
  - `transform: translateY(-50%)`

---

## State Specifications

### Navigation Buttons

#### Default State
- Background: `var(--use-bg-tool-bg)`
- Icon color: `var(--use-icon-prime)`
- Circular shape, 40px × 40px

#### Hover State
- Background: `var(--use-hover-box-hover)`
- Icon color: `var(--use-icon-emph)`
- Transition: `0.2s ease`

#### Active/Pressed State
- Background: `var(--use-hover-box-mouse-down)`
- Transition: `0.2s ease`

#### Disabled State
- Opacity: `0.35`
- Cursor: `auto`
- Pointer events: `none`

### Pagination Bullets

#### Default State
- Size: `8px × 8px`
- Background: `var(--use-icon-prime)`
- Opacity: `0.4`
- Border radius: `50%`

#### Hover State
- Opacity: `0.6`
- Cursor: `pointer`

#### Active State
- Opacity: `1.0`
- Background: `var(--use-icon-emph)`
- Horizontal: `24px × 8px`, border radius `4px`
- Vertical: `8px × 24px`, border radius `4px`

---

## Keyboard Navigation

### Built-in Controls
- **Horizontal Carousels**: 
  - `ArrowLeft`: Previous slide
  - `ArrowRight`: Next slide
- **Vertical Carousels**: 
  - `ArrowUp`: Previous slide
  - `ArrowDown`: Next slide

### Custom Keyboard Controls
Can be implemented using Swiper instance methods:
- `swiper.slidePrev()`: Navigate to previous slide
- `swiper.slideNext()`: Navigate to next slide

Example custom keys:
- W/S keys for vertical navigation
- A/D keys for horizontal navigation

---

## Accessibility Requirements

### WCAG 2.1 Compliance
- **Color Contrast**: All text and interactive elements meet WCAG AA standards
- **Touch Targets**: Navigation buttons (40px × 40px) exceed minimum 44×44px recommendation
- **Keyboard Navigation**: Full keyboard support with arrow keys
- **Focus Indicators**: Visible focus states on all interactive elements

### ARIA Attributes
- Carousel container has `role="region"`
- `aria-label` indicates carousel direction
- Swiper.js automatically adds appropriate ARIA attributes to pagination and navigation

### Screen Reader Support
- Pagination and navigation are announced
- Current slide position is communicated
- Slide content is accessible

---

## Responsive Breakpoints

Breakpoints are configured via the `breakpoints` prop:

```typescript
breakpoints={{
  640: { slidesPerView: 1, spaceBetween: 10 },
  768: { slidesPerView: 2, spaceBetween: 20 },
  1024: { slidesPerView: 3, spaceBetween: 30 },
}}
```

### Common Breakpoints
- **Mobile**: `640px` and below
- **Tablet**: `641px` to `1023px`
- **Desktop**: `1024px` and above

---

## Animation Specifications

### Slide Transitions
- Default: Smooth slide transition (handled by Swiper.js)
- Duration: Configurable via Swiper options
- Easing: Configurable via Swiper options

### Navigation Button Transitions
- Property: `all`
- Duration: `0.2s`
- Timing: `ease`

### Pagination Bullet Transitions
- Property: `all`
- Duration: `0.2s`
- Timing: `ease`

---

## Implementation Notes

### CSS Modules
- All styles use CSS Modules to avoid conflicts
- Global Swiper classes are targeted using `:global()` selector
- Component-specific classes use CSS Modules

### Component Architecture
- **Main Component**: `SwiperCarousel` - Wraps Swiper.js functionality
- **Sub-component**: `SwiperPagination` - Standalone pagination component
  - Can be used independently for debugging
  - Supports horizontal and vertical directions
  - Supports bullets, fraction, and progressbar types

### Swiper Integration
- Uses Swiper.js React components (`Swiper`, `SwiperSlide`)
- Modules: `Navigation`, `Pagination`, `Autoplay`
- CSS imports: `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination`

### Ref Management
- Swiper instance stored in ref for keyboard control
- Pagination element ref passed to Swiper via `el` option
- Refs updated in `onSwiper` callback and `useEffect`

---

## AI Implementation Notes

**When implementing this component, AI must:**

1. **Design Tokens**
   - Always use CSS variables from `@/global-styles/colors.ts`
   - Never use hardcoded hex values or arbitrary colors
   - Reference design tokens consistently

2. **Component Structure**
   - Use `SwiperPagination` sub-component for pagination
   - Ensure pagination element is positioned correctly based on direction
   - Maintain proper z-index layering

3. **Accessibility**
   - Ensure WCAG 2.1 AA compliance
   - Implement proper keyboard navigation
   - Include appropriate ARIA attributes
   - Test with screen readers

4. **Responsive Design**
   - Use breakpoints prop for responsive behavior
   - Test across mobile, tablet, and desktop viewports
   - Ensure touch targets meet minimum size requirements

5. **State Management**
   - Handle Swiper instance lifecycle correctly
   - Update pagination element reference when needed
   - Clean up event listeners in useEffect cleanup

6. **Custom Keyboard Controls**
   - Use Swiper instance methods (`slidePrev`, `slideNext`)
   - Prevent default browser behavior for custom keys
   - Document custom key mappings clearly

---

**Note**: This document should be updated whenever design tokens or specifications change to reflect the current design system.
