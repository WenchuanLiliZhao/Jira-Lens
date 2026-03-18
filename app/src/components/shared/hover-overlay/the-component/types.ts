/**
 * HoverOverlay Component Types
 */

export interface HoverOverlayProps {
  /** 是否禁用 hover 效果 */
  disabled?: boolean;
  
  /** 背景颜色（默认使用 currentColor） */
  color?: string;
  
  /** 自定义类名 */
  className?: string;
}
