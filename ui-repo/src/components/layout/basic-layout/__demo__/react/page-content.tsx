import React from "react";
import { BasicLayout } from "../../the-component";

/**
 * BasicLayout Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the BasicLayout component.
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 */
const PageContent: React.FC = () => {
  return (
    <BasicLayout
      navigation={{
        start: [
          <BasicLayout.LeftSidebarToggle key="left-toggle">
            <button type="button" style={{ cursor: "pointer" }}>
              ☰ Menu
            </button>
          </BasicLayout.LeftSidebarToggle>,
          <div key="logo">Logo</div>,
        ],
        end: [
          <div key="user">User</div>,
        ],
      }}
      leftSidebar={{
        content: (
          <div style={{ padding: "16px" }}>
            <p>Left Sidebar</p>
            <p style={{ fontSize: "12px", opacity: 0.6, marginTop: "8px" }}>
              Click or drag the edge to resize
            </p>
          </div>
        ),
        defaultOpen: true,
      }}
    >
      {/* Main content */}
      {Array.from({ length: 100 }).map((_, index) => (
        <div key={index}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      ))}
    </BasicLayout>
  );
};

export default PageContent;
