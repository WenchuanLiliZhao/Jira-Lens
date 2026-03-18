import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import { SwiperCarousel } from '../../the-component';
import { chartRainbow, use } from '../../../../../global-styles/colors';
import type { Swiper as SwiperType } from 'swiper';


/**
 * SwiperCarousel Demo Page Content
 * 
 * AI Hint: This is a demo page showcasing all usage patterns of the SwiperCarousel component.
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 */
const PageContent: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Refs for custom keyboard control examples
  const verticalSwiperRef = useRef<SwiperType | null>(null);
  const horizontalSwiperRef = useRef<SwiperType | null>(null);

  const basicSlides = [
    <div key="1" style={{ 
      height: '300px', 
      background: chartRainbow['blue-100'], 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: use['text-prime'],
      fontSize: '24px',
      fontWeight: 'bold',
      width: '100%'
    }}>
      Slide 1
    </div>,
    <div key="2" style={{ 
      height: '300px', 
      background: chartRainbow['orange-100'], 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: use['text-prime'],
      fontSize: '24px',
      fontWeight: 'bold',
      width: '100%'
    }}>
      Slide 2
    </div>,
    <div key="3" style={{ 
      height: '300px', 
      background: chartRainbow['green-100'], 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: use['text-prime'],
      fontSize: '24px',
      fontWeight: 'bold',
      width: '100%'
    }}>
      Slide 3
    </div>,
  ];

  const imageSlides = [
    <div key="img1" style={{ 
      height: '400px', 
      background: `linear-gradient(135deg, ${chartRainbow['blue-60']}, ${chartRainbow['purple-60']})`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: use['text-prime'],
      fontSize: '32px',
      fontWeight: 'bold',
      width: '100%'
    }}>
      Image 1
    </div>,
    <div key="img2" style={{ 
      height: '400px', 
      background: `linear-gradient(135deg, ${chartRainbow['orange-60']}, ${chartRainbow['red-60']})`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: use['text-prime'],
      fontSize: '32px',
      fontWeight: 'bold',
      width: '100%'
    }}>
      Image 2
    </div>,
    <div key="img3" style={{ 
      height: '400px', 
      background: `linear-gradient(135deg, ${chartRainbow['green-60']}, ${chartRainbow['yellow-60']})`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: use['text-prime'],
      fontSize: '32px',
      fontWeight: 'bold',
      width: '100%'
    }}>
      Image 3
    </div>,
    <div key="img4" style={{ 
      height: '400px', 
      background: `linear-gradient(135deg, ${chartRainbow['pink-60']}, ${chartRainbow['purple-60']})`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: use['text-prime'],
      fontSize: '32px',
      fontWeight: 'bold',
      width: '100%'
    }}>
      Image 4
    </div>,
  ];

  return (
    <div className={styles["component-demo-container"]}>
      <h1>SwiperCarousel Component Demo</h1>
      
      {/* Basic Carousel */}
      <section className={styles["component-demo-section"]}>
        <h2>Basic Carousel</h2>
        <p>Simple horizontal slides with default settings</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={basicSlides}
            height="300px"
          />
        </div>
      </section>

      {/* With Navigation */}
      <section className={styles["component-demo-section"]}>
        <h2>With Navigation Arrows</h2>
        <p>Previous/Next arrow buttons for navigation</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={basicSlides}
            navigation={true}
            height="300px"
          />
        </div>
      </section>

      {/* With Pagination */}
      <section className={styles["component-demo-section"]}>
        <h2>With Pagination Dots</h2>
        <p>Clickable dots indicator showing current slide</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={basicSlides}
            pagination={true}
            height="300px"
          />
        </div>
      </section>

      {/* With Navigation and Pagination */}
      <section className={styles["component-demo-section"]}>
        <h2>Navigation + Pagination</h2>
        <p>Both navigation arrows and pagination dots</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={imageSlides}
            navigation={true}
            pagination={true}
            height="400px"
          />
        </div>
      </section>

      {/* Autoplay */}
      <section className={styles["component-demo-section"]}>
        <h2>Autoplay</h2>
        <p>Auto-advancing slides every 3 seconds</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={basicSlides}
            autoplay={true}
            pagination={true}
            height="300px"
          />
        </div>
      </section>

      {/* Loop Mode */}
      <section className={styles["component-demo-section"]}>
        <h2>Loop Mode (Infinite Scroll)</h2>
        <p>Continuous loop with no beginning or end</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={basicSlides}
            loop={true}
            navigation={true}
            pagination={true}
            height="300px"
          />
        </div>
      </section>

      {/* Multiple Slides Per View */}
      <section className={styles["component-demo-section"]}>
        <h2>Multiple Slides Per View</h2>
        <p>Show 3 slides at once with spacing</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={basicSlides.concat(basicSlides)}
            slidesPerView={3}
            spaceBetween={20}
            navigation={true}
            pagination={true}
            height="300px"
          />
        </div>
      </section>

      {/* Vertical Slider */}
      <section className={styles["component-demo-section"]}>
        <h2>Vertical Direction</h2>
        <p>Vertical sliding direction</p>
        <div className={styles["demo-wrapper"]} style={{ height: '400px' }}>
          <SwiperCarousel
            slides={basicSlides}
            direction="vertical"
            navigation={true}
            pagination={true}
            height="400px"
          />
        </div>
      </section>

      {/* Responsive Breakpoints */}
      <section className={styles["component-demo-section"]}>
        <h2>Responsive Breakpoints</h2>
        <p>Different slides per view at different screen sizes</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={basicSlides.concat(basicSlides, basicSlides)}
            spaceBetween={20}
            navigation={true}
            pagination={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            height="300px"
          />
        </div>
      </section>

      {/* Fraction Pagination */}
      <section className={styles["component-demo-section"]}>
        <h2>Fraction Pagination</h2>
        <p>Shows current/total slides (e.g., "1 / 5")</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={imageSlides}
            navigation={true}
            pagination={{ enabled: true, type: 'fraction' }}
            height="400px"
          />
        </div>
      </section>

      {/* Progressbar Pagination */}
      <section className={styles["component-demo-section"]}>
        <h2>Progressbar Pagination</h2>
        <p>Progress bar showing slide position</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={imageSlides}
            navigation={true}
            pagination={{ enabled: true, type: 'progressbar' }}
            height="400px"
          />
        </div>
      </section>

      {/* With Callback */}
      <section className={styles["component-demo-section"]}>
        <h2>Slide Change Callback</h2>
        <p>Track current slide index: <strong>Slide {currentSlide + 1}</strong></p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={basicSlides}
            navigation={true}
            pagination={true}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            height="300px"
          />
        </div>
      </section>

      {/* Custom Keyboard Control: W/S for Vertical */}
      <section className={styles["component-demo-section"]}>
        <h2>Custom Keyboard Control: W/S Keys (Vertical)</h2>
        <p>Use <strong>W</strong> key to slide up, <strong>S</strong> key to slide down. Click on the carousel first to focus it.</p>
        <div className={styles["demo-wrapper"]} style={{ height: '500px' }}>
          <SwiperCarousel
            slides={basicSlides}
            direction="vertical"
            navigation={true}
            pagination={true}
            height="100%"
            onSlideChange={(swiper: SwiperType) => {
              verticalSwiperRef.current = swiper;
            }}
            swiperOptions={{
              onSwiper: (swiper: SwiperType) => {
                verticalSwiperRef.current = swiper;
              },
            }}
          />
        </div>
        <CustomKeyboardHandler
          swiperRef={verticalSwiperRef}
          direction="vertical"
          upKey="w"
          downKey="s"
        />
      </section>

      {/* Custom Keyboard Control: A/D for Horizontal */}
      <section className={styles["component-demo-section"]}>
        <h2>Custom Keyboard Control: A/D Keys (Horizontal)</h2>
        <p>Use <strong>A</strong> key to slide left, <strong>D</strong> key to slide right. Click on the carousel first to focus it.</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={basicSlides}
            direction="horizontal"
            navigation={true}
            pagination={true}
            height="300px"
            onSlideChange={(swiper: SwiperType) => {
              horizontalSwiperRef.current = swiper;
            }}
            swiperOptions={{
              onSwiper: (swiper: SwiperType) => {
                horizontalSwiperRef.current = swiper;
              },
            }}
          />
        </div>
        <CustomKeyboardHandler
          swiperRef={horizontalSwiperRef}
          direction="horizontal"
          leftKey="a"
          rightKey="d"
        />
      </section>

      {/* All Features Combined */}
      <section className={styles["component-demo-section"]}>
        <h2>All Features Combined</h2>
        <p>Navigation, pagination, autoplay, loop, and responsive breakpoints</p>
        <div className={styles["demo-wrapper"]}>
          <SwiperCarousel
            slides={imageSlides}
            navigation={true}
            pagination={true}
            autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
            loop={true}
            spaceBetween={30}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              1024: {
                slidesPerView: 2,
              },
            }}
            height="400px"
          />
        </div>
      </section>
    </div>
  );
};

/**
 * Custom Keyboard Handler Component
 * Handles custom keyboard controls for Swiper carousel
 */
interface CustomKeyboardHandlerProps {
  swiperRef: React.MutableRefObject<SwiperType | null>;
  direction: 'horizontal' | 'vertical';
  upKey?: string;
  downKey?: string;
  leftKey?: string;
  rightKey?: string;
}

const CustomKeyboardHandler: React.FC<CustomKeyboardHandlerProps> = ({
  swiperRef,
  direction,
  upKey,
  downKey,
  leftKey,
  rightKey,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const swiper = swiperRef.current;
      if (!swiper) return;

      const key = event.key.toLowerCase();

      if (direction === 'vertical') {
        // Vertical: W/S keys
        if (upKey && key === upKey.toLowerCase()) {
          event.preventDefault();
          swiper.slidePrev();
        } else if (downKey && key === downKey.toLowerCase()) {
          event.preventDefault();
          swiper.slideNext();
        }
      } else {
        // Horizontal: A/D keys
        if (leftKey && key === leftKey.toLowerCase()) {
          event.preventDefault();
          swiper.slidePrev();
        } else if (rightKey && key === rightKey.toLowerCase()) {
          event.preventDefault();
          swiper.slideNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [swiperRef, direction, upKey, downKey, leftKey, rightKey]);

  return null;
};

export default PageContent;
