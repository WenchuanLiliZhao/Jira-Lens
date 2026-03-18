---
status: in-progress
figma: [draft]
created: 2025-01-27
updated: 2025-01-27
category: layout
complexity: B
aliases: [Swiper, Carousel, Slider]
dependencies: []
externalDependencies: ['react', 'swiper']
aiContext: |
  Use SwiperCarousel for touch-enabled, swipeable content carousels.
  Supports navigation arrows, pagination, autoplay, loop, and responsive breakpoints.
  Ideal for image galleries, testimonials, product showcases, and mobile-friendly slideshows.
---

# SwiperCarousel Component

## Quick Summary

SwiperCarousel is a React wrapper component for Swiper.js that provides a touch-enabled, feature-rich carousel/slider for displaying content in a swipeable format. It supports navigation arrows, pagination indicators, autoplay, infinite loop, and responsive breakpoints. Perfect for image galleries, product showcases, testimonials, and mobile-friendly slideshows.

**AI Hint**: When user needs a carousel/slider, use SwiperCarousel. For simple image galleries, enable navigation and pagination. For auto-rotating content, enable autoplay. Use breakpoints prop for responsive behavior.

---

## When to Use

✅ **DO use SwiperCarousel when:**
- Displaying image galleries or product carousels
- Showing testimonials or reviews in a slideshow format
- Creating mobile-friendly content sliders
- Need touch/swipe gestures for navigation
- Requiring autoplay or loop functionality
- Building responsive carousels with different layouts per breakpoint

❌ **DON'T use SwiperCarousel when:**
- You need a simple static grid layout (use BentoGrid or CSS Grid instead)
- Content doesn't need swipe/touch interaction (consider a simple div with overflow)
- You need a complex nested carousel structure (consider custom implementation)

---

## Visual Variants

### Direction

#### Horizontal (`direction="horizontal"`)
- **Default**: Slides move left/right
- **Navigation**: Arrows on left/right sides
- **Pagination**: Dots at bottom center
- **Use cases**: Image galleries, product carousels, testimonials
- **AI hint**: Use for standard horizontal content sliders

#### Vertical (`direction="vertical"`)
- **Slides move**: Up/down
- **Navigation**: Arrows at top/bottom (rotated 90°)
- **Pagination**: Dots on right side, vertically arranged
- **Use cases**: Mobile-first vertical content, full-screen presentations
- **AI hint**: Use for mobile-optimized or vertical content flows

### Pagination Types

#### Bullets (`pagination={{ type: 'bullets' }}`)
- **Default**: Circular dots indicating slide position
- **Active**: Expands horizontally (horizontal) or vertically (vertical)
- **Use cases**: Most common use case, clear visual indicators
- **AI hint**: Default choice for most carousels

#### Fraction (`pagination={{ type: 'fraction' }}`)
- **Shows**: Current/total slides (e.g., "1 / 5")
- **Use cases**: When exact position is important, minimal UI
- **AI hint**: Use when space is limited or precise position matters

#### Progressbar (`pagination={{ type: 'progressbar' }}`)
- **Shows**: Progress bar indicating slide position
- **Use cases**: Long content sequences, progress indication
- **AI hint**: Use for content that benefits from progress visualization

---

## Props API

<!-- Define the component's props here -->

<!-- Suggested organization:
### Content Props
- Props that control what content is displayed

### Design Props
- Props that control visual appearance (variants, sizes, colors, etc.)

### Behavior Props
- Props that control behavior (disabled, onClick, etc.)
-->

```typescript
interface SwiperCarouselProps {
  /** Array of slide content (React nodes or objects with content/key) */
  slides: SlideContent[];
  
  /** Direction: 'horizontal' | 'vertical' (default: 'horizontal') */
  direction?: 'horizontal' | 'vertical';
  
  /** Number of slides per view (default: 1) */
  slidesPerView?: number | 'auto';
  
  /** Space between slides in px (default: 0) */
  spaceBetween?: number;
  
  /** Enable infinite loop (default: false) */
  loop?: boolean;
  
  /** Autoplay configuration (boolean or config object) */
  autoplay?: boolean | AutoplayConfig;
  
  /** Navigation arrows (boolean or config object) */
  navigation?: boolean | NavigationConfig;
  
  /** Pagination dots/indicators (boolean or config object) */
  pagination?: boolean | PaginationConfig;
  
  /** Responsive breakpoints configuration */
  breakpoints?: { [width: number]: { slidesPerView?: number; spaceBetween?: number; [key: string]: any } };
  
  /** Callback when slide changes */
  onSlideChange?: (swiper: any) => void;
  
  /** Additional Swiper.js options */
  swiperOptions?: Record<string, any>;
  
  /** Container height (CSS value or number) */
  height?: string | number;
  
  /** Custom class names */
  className?: string;
  slideClassName?: string;
}
```

---

## Quick Start

### Basic Usage

```tsx
import { SwiperCarousel } from '@/components/layout/swiper-carousel';

const slides = [
  <div key="1">Slide 1 Content</div>,
  <div key="2">Slide 2 Content</div>,
  <div key="3">Slide 3 Content</div>,
];

<SwiperCarousel
  slides={slides}
  navigation={true}
  pagination={true}
  height="400px"
/>
```

### With Autoplay and Loop

```tsx
<SwiperCarousel
  slides={slides}
  autoplay={true}
  loop={true}
  navigation={true}
  pagination={true}
  height="400px"
/>
```

### Responsive Breakpoints

```tsx
<SwiperCarousel
  slides={slides}
  spaceBetween={20}
  navigation={true}
  pagination={true}
  breakpoints={{
    640: { slidesPerView: 1, spaceBetween: 10 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 30 },
  }}
  height="400px"
/>
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

SwiperCarousel includes built-in accessibility features from Swiper.js:

- **Keyboard Navigation**: 
  - **Horizontal carousels**: Use `ArrowLeft` and `ArrowRight` keys to navigate
  - **Vertical carousels**: Use `ArrowUp` and `ArrowDown` keys to navigate
  - Keyboard control works when the carousel container has focus (click on carousel or tab to it)
  - **Custom keys**: Can be implemented using Swiper instance methods (see examples below)
- **Focus Indicators**: Navigation buttons have visible focus states
- **ARIA Labels**: Swiper automatically adds appropriate ARIA attributes, and the carousel container has `role="region"` and `aria-label`
- **Touch Targets**: Navigation buttons (40px × 40px) meet accessibility requirements
- **Screen Reader Support**: Pagination and navigation are announced to screen readers
- **Color Contrast**: Uses design tokens that meet WCAG 2.1 AA contrast requirements

For custom implementations, ensure all interactive elements are keyboard accessible and have proper ARIA labels.

### Custom Keyboard Controls

You can implement custom keyboard controls by accessing the Swiper instance:

```tsx
import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';

const swiperRef = useRef<SwiperType | null>(null);

<SwiperCarousel
  slides={slides}
  onSlideChange={(swiper) => {
    swiperRef.current = swiper;
  }}
  swiperOptions={{
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
    },
  }}
/>

// Then use keyboard event listeners
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'w' && swiperRef.current) {
      swiperRef.current.slidePrev(); // For vertical
    } else if (e.key === 's' && swiperRef.current) {
      swiperRef.current.slideNext(); // For vertical
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## Sub-components

### SwiperPagination

A standalone pagination component that can be used independently for debugging and styling.

```tsx
import { SwiperPagination } from '@/components/layout/swiper-carousel';

<SwiperPagination
  pagination={true}
  direction="vertical"
/>
```

**Props:**
- `pagination`: `boolean | PaginationConfig` - Pagination configuration
- `direction`: `'horizontal' | 'vertical'` - Carousel direction
- `className?`: `string` - Custom class name

**Use cases:**
- Debugging pagination styles independently
- Custom pagination implementations
- Testing pagination behavior

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo
  - Includes examples for all features
  - Custom keyboard controls (W/S for vertical, A/D for horizontal)
  - All pagination types
  - Responsive breakpoints
  - Autoplay and loop modes

**AI Note**: Reference the demo files for actual, working code patterns.
