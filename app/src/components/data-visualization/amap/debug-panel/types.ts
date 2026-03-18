import type maplibregl from 'maplibre-gl';
import type React from 'react';
import type {
  ColorState,
  InitialViewState,
  StyleState,
  ToggleState,
  ZoomState,
} from '../lib/mapParaConfig';

/**
 * An additional section injected into the debug panel by the consumer.
 * Keeps the panel generic while allowing playground-specific controls.
 */
export interface ExtraSection {
  /** Section heading displayed in the panel */
  label: string;
  /** Controls to render inside the section */
  content: React.ReactNode;
  /** Optional code snippet appended to the Appearance "copy for prompt" output */
  codeOutput?: string;
}

export interface AmapStyleDebugPanelProps {
  /**
   * MapLibre 地图实例。
   * 通过 <AmapMap onLoad={setMap} /> 的回调获取后传入。
   * 为 null 时面板渲染但所有地图操作被跳过。
   */
  map: maplibregl.Map | null;

  /**
   * 是否使用中国地图标准（影响国界图层 ID 映射，应与 AmapMap 的 chinaMapStandard 一致）。
   * 默认 true。
   */
  chinaMapStandard?: boolean;

  /**
   * 面板初始是否展开。默认 true。
   */
  defaultOpen?: boolean;

  /**
   * 高德地图实例（通过 AmapMap 的 onAmapLoad 回调获取）。
   * 传入后，面板会显示高德相关的功能：官方主题切换、POI 搜索、路况/卫星图层。
   * 不传（或为 null/undefined）时，这些功能区域不显示。
   */
  amap?: unknown;

  /** 容器 className */
  className?: string;

  /** Initial colors (from AmapMap initialColors). Default: mapParaConfig.DEFAULT_COLORS. */
  initialColors?: ColorState;

  /** Initial styles (from AmapMap initialStyles). Default: mapParaConfig.DEFAULT_STYLES. */
  initialStyles?: StyleState;

  /** Initial zooms (from AmapMap initialZooms). Default: mapParaConfig.DEFAULT_ZOOMS. */
  initialZooms?: ZoomState;

  /** Initial view (from AmapMap initialView). Used for generateCodeOutput fallback when map is null. */
  initialView?: InitialViewState;

  /** Initial toggles (from AmapMap initialToggles). Default: mapParaConfig.DEFAULT_TOGGLES. */
  initialToggles?: ToggleState;

  /** Display label for the active color scheme (e.g. "Default", "Dark"). Used in code output context. */
  colorSchemeLabel?: string;

  /** Active UI theme variant. Used in code output context. */
  themeVariant?: 'light' | 'dark';

  /**
   * Additional sections injected by the consumer (e.g. overlay-specific style controls).
   * Each section is rendered after the Appearance block, and its codeOutput (if provided)
   * is appended to the Appearance "copy for prompt" text.
   */
  extraSections?: ExtraSection[];

  /**
   * Additional sections injected into the "View & Structure" group specifically.
   * Each section is rendered after the Zoom visibility sliders, and its codeOutput (if provided)
   * is appended to the Structure "copy for prompt" text.
   */
  extraStructureSections?: ExtraSection[];
}
