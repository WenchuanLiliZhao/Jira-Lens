/// <reference types="vite/client" />

// CSS Modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// CSS imports
declare module '*.css' {
  const content: string;
  export default content;
}

// Swiper CSS imports
declare module 'swiper/css' {
  const content: string;
  export default content;
}

declare module 'swiper/css/navigation' {
  const content: string;
  export default content;
}

declare module 'swiper/css/pagination' {
  const content: string;
  export default content;
}

// 高德地图 JSAPI 无官方 TypeScript 类型，通过 window 动态加载后使用
declare const AMap: any;
