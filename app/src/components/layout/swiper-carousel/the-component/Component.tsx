/**
 * SwiperCarousel Component - Main Implementation
 *
 * A React wrapper component for Swiper.js that provides a touch-enabled,
 * feature-rich carousel/slider layout component.
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './styles.module.scss';
import type { SwiperCarouselProps } from './types';
import { SwiperPagination } from './SwiperPagination';

export const SwiperCarousel = React.forwardRef<HTMLDivElement, SwiperCarouselProps>(
  (props, ref) => {
    const {
      slides,
      direction = 'horizontal',
      slidesPerView = 1,
      spaceBetween = 0,
      loop = false,
      autoplay = false,
      navigation = false,
      pagination = false,
      breakpoints,
      onSlideChange,
      swiperOptions,
      className,
      slideClassName,
      height = 'auto',
      ...restProps
    } = props;

    // Configure modules
    const modules = useMemo(() => {
      const mods = [];
      if (navigation) mods.push(Navigation);
      if (pagination) mods.push(Pagination);
      if (autoplay) mods.push(Autoplay);
      return mods;
    }, [navigation, pagination, autoplay]);

    // Configure autoplay
    const autoplayConfig = useMemo(() => {
      if (!autoplay) return false;
      if (typeof autoplay === 'boolean') {
        return { delay: 3000, disableOnInteraction: false };
      }
      return {
        delay: autoplay.delay ?? 3000,
        disableOnInteraction: autoplay.disableOnInteraction ?? false,
        pauseOnMouseEnter: autoplay.pauseOnMouseEnter ?? false,
        stopOnLastSlide: autoplay.stopOnLastSlide ?? false,
      };
    }, [autoplay]);

    // Configure navigation
    const navigationConfig = useMemo(() => {
      if (!navigation) return false;
      if (typeof navigation === 'boolean') {
        return true; // Use Swiper's default navigation
      }
      return {
        nextEl: navigation.nextEl,
        prevEl: navigation.prevEl,
        hideOnClick: navigation.hideOnClick ?? false,
        disabledClass: navigation.disabledClass,
      };
    }, [navigation]);

    // Pagination element ref for Swiper
    const paginationElRef = useRef<HTMLDivElement>(null);
    const swiperInstanceRef = useRef<SwiperType | null>(null);

    // Configure pagination for Swiper
    const paginationConfig = useMemo(() => {
      if (!pagination) return false;
      
      const config: any = {};
      
      if (typeof pagination === 'boolean') {
        config.clickable = true;
      } else {
        if (pagination.type) config.type = pagination.type;
        config.clickable = pagination.clickable ?? true;
        if (pagination.bulletClass) config.bulletClass = pagination.bulletClass;
        if (pagination.bulletActiveClass) config.bulletActiveClass = pagination.bulletActiveClass;
      }
      
      return config;
    }, [pagination]);

    // Update pagination element reference after Swiper initializes
    useEffect(() => {
      if (pagination && swiperInstanceRef.current && paginationElRef.current) {
        const swiper = swiperInstanceRef.current;
        // Set pagination element and reinitialize
        if (swiper.pagination) {
          swiper.pagination.el = paginationElRef.current;
          swiper.pagination.init();
          swiper.pagination.render();
          swiper.pagination.update();
        }
      }
    }, [pagination, paginationElRef.current]);

    // Build className
    const componentClassName = [
      styles['swiper-carousel'],
      className,
    ].filter(Boolean).join(' ');

    // Container style
    const containerStyle: React.CSSProperties = {
      height: typeof height === 'number' ? `${height}px` : height,
    };

    // Handle Swiper instance initialization
    const handleSwiper = (swiper: SwiperType) => {
      swiperInstanceRef.current = swiper;
      
      // Update pagination element if available
      if (pagination && paginationElRef.current && swiper.pagination) {
        swiper.pagination.el = paginationElRef.current;
        swiper.pagination.init();
        swiper.pagination.render();
        swiper.pagination.update();
      }
    };

    // Handle slide change
    const handleSlideChange = (swiper: SwiperType) => {
      if (onSlideChange) {
        onSlideChange(swiper);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const swiper = swiperInstanceRef.current;
      if (!swiper) return;

      // Prevent default behavior for arrow keys
      if (direction === 'horizontal') {
        // Horizontal: Left/Right arrows
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          swiper.slidePrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          swiper.slideNext();
        }
      } else {
        // Vertical: Up/Down arrows
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          swiper.slidePrev();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          swiper.slideNext();
        }
      }
    };

    return (
      <div
        ref={ref}
        className={componentClassName}
        style={containerStyle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label={direction === 'horizontal' ? 'Carousel' : 'Vertical carousel'}
        {...restProps}
      >
        <Swiper
          modules={modules}
          direction={direction}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          loop={loop}
          autoplay={autoplayConfig}
          navigation={navigationConfig}
          pagination={paginationConfig}
          breakpoints={breakpoints}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          className={styles['swiper-container']}
          data-direction={direction}
          {...swiperOptions}
        >
          {slides.map((slide, index) => {
            // Extract key: always ensure uniqueness by combining with index
            let key: string | number;
            if (typeof slide === 'object' && slide !== null && 'key' in slide && slide.key !== undefined && slide.key !== null) {
              // If key is provided, combine with index to ensure uniqueness
              key = `${slide.key}-${index}`;
            } else {
              // Use index as key (always unique)
              key = index;
            }
            
            const content = typeof slide === 'object' && slide !== null && 'content' in slide
              ? slide.content
              : slide;

            return (
              <SwiperSlide
                key={key}
                className={slideClassName || styles['swiper-slide']}
              >
                {content}
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* Render pagination outside Swiper container but inside carousel wrapper */}
        {pagination && (
          <SwiperPagination
            pagination={pagination}
            direction={direction}
            ref={paginationElRef}
          />
        )}
      </div>
    );
  }
);

SwiperCarousel.displayName = 'SwiperCarousel';
