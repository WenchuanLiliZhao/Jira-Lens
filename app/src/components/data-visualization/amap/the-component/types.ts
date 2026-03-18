import type maplibregl from 'maplibre-gl';
import type React from 'react';
import type {
  ColorState,
  InitialViewState,
  StyleState,
  ToggleState,
  ZoomState,
} from '../lib/mapParaConfig';
import type { ExtraSection } from '../debug-panel/types';

export interface AmapMapProps {
  /**
   * 初始地图颜色配置。
   * 如果不传，使用 mapParaConfig.ts 中的 DEFAULT_COLORS。
   */
  initialColors?: ColorState;

  /**
   * 初始样式配置（线宽、透明度等）。
   * 如果不传，使用 mapParaConfig.ts 中的 DEFAULT_STYLES。
   */
  initialStyles?: StyleState;

  /**
   * 初始缩放级别配置。
   * 如果不传，使用 mapParaConfig.ts 中的 DEFAULT_ZOOMS。
   */
  initialZooms?: ZoomState;

  /**
   * 初始开关配置（如国界 casing 描边）。
   * 如果不传，使用 mapParaConfig.ts 中的 DEFAULT_TOGGLES。
   */
  initialToggles?: ToggleState;

  /**
   * 初始地图视图（中心、缩放）。
   * 如果不传，使用 mapParaConfig.ts 中的 DEFAULT_INITIAL_VIEW。
   */
  initialView?: InitialViewState;

  /**
   * 是否使用中国地图标准国界（叠加 DataV 中国国界 GeoJSON）。
   * 默认 true。
   */
  chinaMapStandard?: boolean;

  /**
   * 地图加载完成后的回调，返回 maplibregl.Map 实例。
   * 通过此回调，外部可以拿到 map 实例并调用 setPaintProperty 等方法。
   */
  onLoad?: (map: maplibregl.Map) => void;

  /**
   * 地图视口变化后的回调（moveend 事件触发）。
   */
  onMoveEnd?: (map: maplibregl.Map) => void;

  /**
   * 高德地图 Key。
   * 传入后，组件会动态加载高德 JSAPI，并在加载成功后切换到高德地图。
   * 不传（或为空字符串）时，使用 MapLibre 矢量地图（默认行为）。
   */
  amapKey?: string;

  /**
   * 高德地图加载成功后的回调，返回高德 AMap.Map 实例。
   * 通过此回调，外部（如 AmapStyleDebugPanel）可以拿到高德实例。
   */
  onAmapLoad?: (amapInstance: unknown) => void;

  /**
   * 高德地图加载失败的回调。
   */
  onAmapError?: (error: unknown) => void;

  /**
   * 是否在地图内嵌入调试面板（AmapStyleDebugPanel）。
   * 启用后，map/amap 实例自动注入面板，无需外部手动串联。
   * 默认 false。
   */
  showDebugPanel?: boolean;

  /**
   * 调试面板初始是否展开，仅在 showDebugPanel=true 时有效。
   * 默认 true。
   */
  debugPanelDefaultOpen?: boolean;

  /**
   * 当前配色方案名称，用于 debug panel 的 code output 上下文标注（例如 "Default"、"Dark"）。
   * 仅在 showDebugPanel=true 时有意义。
   */
  colorSchemeLabel?: string;

  /**
   * 当前 UI 主题变体（light/dark），用于 debug panel 的 code output 上下文标注。
   * 仅在 showDebugPanel=true 时有意义。
   */
  themeVariant?: 'light' | 'dark';

  /** 容器 div 的 className */
  className?: string;

  /** 容器 div 的 style，通常用来指定高度，例如 { height: '100dvh' } */
  style?: React.CSSProperties;

  /**
   * Additional sections passed through to AmapStyleDebugPanel.
   * Only meaningful when showDebugPanel=true.
   * Use this to inject overlay-specific style controls (e.g. catchment layer styling)
   * without coupling the component to any particular data layer.
   */
  extraDebugSections?: ExtraSection[];

  /**
   * Additional sections injected into the "View & Structure" group of AmapStyleDebugPanel.
   * Only meaningful when showDebugPanel=true.
   * Use this to add structure-level controls (e.g. map overlay zoom ranges)
   * whose codeOutput belongs in the structure prompt rather than the appearance prompt.
   */
  extraStructureDebugSections?: ExtraSection[];
}
