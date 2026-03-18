import React, { useState } from "react";
import styles from "./styles.module.scss";
import { ButtonGroup } from "../../the-component";
import { Button } from "../../../button/the-component";

/**
 * ButtonGroup Demo Page Content
 *
 * AI Hint: This is a demo page showcasing usage patterns of the ButtonGroup component
 * with all Phase 1 and Phase 2 features including selection modes and style variants.
 */
const PageContent: React.FC = () => {
  // State for controlled examples
  const [alignment, setAlignment] = useState<string>("left");
  const [formats, setFormats] = useState<string[]>(["bold"]);
  const [view, setView] = useState<string>("grid");
  const [filter, setFilter] = useState<string>("all");

  return (
    <div className={styles["component-demo-container"]}>
      <h1>Button Group Component Demo</h1>

      {/* ========== SELECTION MODES ========== */}
      <section className={styles["component-demo-section"]}>
        <h2>Selection Modes</h2>
        
        <div className={styles["demo-subsection"]}>
          <h3>Single Selection (Radio-like)</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined"
              value={alignment}
              onChange={(val) => setAlignment(val as string)}
            >
              <Button value="left" startIcon="format_align_left">Left</Button>
              <Button value="center" startIcon="format_align_center">Center</Button>
              <Button value="right" startIcon="format_align_right">Right</Button>
              <Button value="justify" startIcon="format_align_justify">Justify</Button>
            </ButtonGroup>
            <span className={styles["demo-value"]}>Selected: {alignment}</span>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Multiple Selection (Checkbox-like)</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="multiple" 
              variant="outlined"
              value={formats}
              onChange={(val) => setFormats(val as string[])}
            >
              <Button value="bold" startIcon="format_bold">Bold</Button>
              <Button value="italic" startIcon="format_italic">Italic</Button>
              <Button value="underline" startIcon="format_underlined">Underline</Button>
              <Button value="color" startIcon="format_color_text">Color</Button>
            </ButtonGroup>
            <span className={styles["demo-value"]}>Selected: {formats.join(", ") || "none"}</span>
          </div>
        </div>
      </section>

      {/* ========== STYLE VARIANTS ========== */}
      <section className={styles["component-demo-section"]}>
        <h2>Style Variants</h2>

        <div className={styles["demo-subsection"]}>
          <h3>Outlined Variant</h3>
          <p className={styles["demo-description"]}>
            Active = contained+primary, Inactive = outlined+default
          </p>
          <div className={styles["demo-row"]}>
            <ButtonGroup mode="single" variant="outlined" defaultValue="tab1">
              <Button value="tab1">Tab 1</Button>
              <Button value="tab2">Tab 2</Button>
              <Button value="tab3">Tab 3</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Ghost Variant</h3>
          <p className={styles["demo-description"]}>
            Active = contained+primary, Inactive = ghost+default
          </p>
          <div className={styles["demo-row"]}>
            <ButtonGroup mode="single" variant="ghost" defaultValue="option1">
              <Button value="option1">Option 1</Button>
              <Button value="option2">Option 2</Button>
              <Button value="option3">Option 3</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Contained Variant</h3>
          <p className={styles["demo-description"]}>
            Active = contained+primary, Inactive = contained+default
          </p>
          <div className={styles["demo-row"]}>
            <ButtonGroup mode="single" variant="contained" defaultValue="a">
              <Button value="a">Choice A</Button>
              <Button value="b">Choice B</Button>
              <Button value="c">Choice C</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* ========== COLOR OPTIONS ========== */}
      <section className={styles["component-demo-section"]}>
        <h2>Color Options</h2>
        <p className={styles["demo-description"]}>
          ButtonGroup supports most Button color options (primary, success, error, info, warning). 
          Selected buttons use the specified color, while unselected buttons always use <strong>default</strong> color for visual consistency.
          Note: <strong>secondary</strong> color is not supported and will fallback to <strong>primary</strong>.
        </p>

        <div className={styles["demo-subsection"]}>
          <h3>Primary (default)</h3>
          <div className={styles["demo-row"]} style={{ flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Outlined:</p>
              <ButtonGroup mode="single" variant="outlined" color="primary" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Ghost:</p>
              <ButtonGroup mode="single" variant="ghost" color="primary" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Contained:</p>
              <ButtonGroup mode="single" variant="contained" color="primary" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Success</h3>
          <div className={styles["demo-row"]} style={{ flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Outlined:</p>
              <ButtonGroup mode="single" variant="outlined" color="success" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Ghost:</p>
              <ButtonGroup mode="single" variant="ghost" color="success" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Contained:</p>
              <ButtonGroup mode="single" variant="contained" color="success" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Error</h3>
          <div className={styles["demo-row"]} style={{ flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Outlined:</p>
              <ButtonGroup mode="single" variant="outlined" color="error" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Ghost:</p>
              <ButtonGroup mode="single" variant="ghost" color="error" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Contained:</p>
              <ButtonGroup mode="single" variant="contained" color="error" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Info</h3>
          <div className={styles["demo-row"]} style={{ flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Outlined:</p>
              <ButtonGroup mode="single" variant="outlined" color="info" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Ghost:</p>
              <ButtonGroup mode="single" variant="ghost" color="info" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Contained:</p>
              <ButtonGroup mode="single" variant="contained" color="info" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Warning</h3>
          <div className={styles["demo-row"]} style={{ flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Outlined:</p>
              <ButtonGroup mode="single" variant="outlined" color="warning" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Ghost:</p>
              <ButtonGroup mode="single" variant="ghost" color="warning" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Contained:</p>
              <ButtonGroup mode="single" variant="contained" color="warning" defaultValue="a">
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Multiple Selection with Colors</h3>
          <div className={styles["demo-row"]} style={{ flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Success (multiple):</p>
              <ButtonGroup mode="multiple" variant="outlined" color="success" defaultValue={["a", "c"]}>
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
                <Button value="d">Option D</Button>
              </ButtonGroup>
            </div>
            <div>
              <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Error (multiple):</p>
              <ButtonGroup mode="multiple" variant="outlined" color="error" defaultValue={["a", "c"]}>
                <Button value="a">Option A</Button>
                <Button value="b">Option B</Button>
                <Button value="c">Option C</Button>
                <Button value="d">Option D</Button>
              </ButtonGroup>
            </div>
          </div>
          <p className={styles["demo-description"]}>
            Selected buttons use the specified color, unselected buttons use default color.
          </p>
        </div>
      </section>

      {/* ========== SIZES ========== */}
      <section className={styles["component-demo-section"]}>
        <h2>Sizes</h2>

        <div className={styles["demo-subsection"]}>
          <h3>Small</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined" 
              size="small"
              defaultValue="1"
            >
              <Button value="1">One</Button>
              <Button value="2">Two</Button>
              <Button value="3">Three</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Medium (default)</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined" 
              size="medium"
              defaultValue="1"
            >
              <Button value="1">One</Button>
              <Button value="2">Two</Button>
              <Button value="3">Three</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Large</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined" 
              size="large"
              defaultValue="1"
            >
              <Button value="1">One</Button>
              <Button value="2">Two</Button>
              <Button value="3">Three</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* ========== ORIENTATION ========== */}
      <section className={styles["component-demo-section"]}>
        <h2>Orientation</h2>

        <div className={styles["demo-subsection"]}>
          <h3>Horizontal (default)</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined"
              orientation="horizontal"
              defaultValue="item1"
            >
              <Button value="item1">Item 1</Button>
              <Button value="item2">Item 2</Button>
              <Button value="item3">Item 3</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Vertical</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined"
              orientation="vertical"
              defaultValue="item1"
            >
              <Button value="item1">Item 1</Button>
              <Button value="item2">Item 2</Button>
              <Button value="item3">Item 3</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* ========== SEGMENTED ========== */}
      <section className={styles["component-demo-section"]}>
        <h2>Segmented vs Non-Segmented</h2>

        <div className={styles["demo-subsection"]}>
          <h3>Segmented (default, merged borders)</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined"
              segmented={true}
              defaultValue="a"
            >
              <Button value="a">Option A</Button>
              <Button value="b">Option B</Button>
              <Button value="c">Option C</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Non-Segmented (with gap)</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined"
              segmented={false}
              defaultValue="a"
            >
              <Button value="a">Option A</Button>
              <Button value="b">Option B</Button>
              <Button value="c">Option C</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* ========== PHASE 2 FEATURES ========== */}
      <section className={styles["component-demo-section"]}>
        <h2>Phase 2 Features</h2>

        <div className={styles["demo-subsection"]}>
          <h3>Disabled State</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined"
              disabled
              defaultValue="option1"
            >
              <Button value="option1">Option 1</Button>
              <Button value="option2">Option 2</Button>
              <Button value="option3">Option 3</Button>
            </ButtonGroup>
          </div>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined"
              defaultValue="option1"
            >
              <Button value="option1">Enabled</Button>
              <Button value="option2" disabled>Disabled</Button>
              <Button value="option3">Enabled</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Exclusive Mode (Single + Allow Deselection)</h3>
          <p className={styles["demo-description"]}>
            Click the active button to deselect it
          </p>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined"
              exclusive
              value={filter}
              onChange={(val) => setFilter(val as string)}
            >
              <Button value="all">All</Button>
              <Button value="active">Active</Button>
              <Button value="completed">Completed</Button>
            </ButtonGroup>
            <span className={styles["demo-value"]}>Filter: {filter || "none"}</span>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Full Width</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="outlined"
              fullWidth
              value={view}
              onChange={(val) => setView(val as string)}
            >
              <Button value="list" startIcon="view_list">List</Button>
              <Button value="grid" startIcon="view_module">Grid</Button>
              <Button value="timeline" startIcon="view_timeline">Timeline</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* ========== REAL-WORLD EXAMPLES ========== */}
      <section className={styles["component-demo-section"]}>
        <h2>Real-World Examples</h2>

        <div className={styles["demo-subsection"]}>
          <h3>Text Editor Toolbar</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup mode="multiple" variant="ghost" segmented={false}>
              <Button value="bold" startIcon="format_bold" />
              <Button value="italic" startIcon="format_italic" />
              <Button value="underline" startIcon="format_underlined" />
              <Button value="strikethrough" startIcon="strikethrough_s" />
            </ButtonGroup>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>View Switcher</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="single" 
              variant="contained"
              defaultValue="cards"
            >
              <Button value="list" startIcon="list">List</Button>
              <Button value="cards" startIcon="grid_view">Cards</Button>
              <Button value="table" startIcon="table_chart">Table</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className={styles["demo-subsection"]}>
          <h3>Filter Chips</h3>
          <div className={styles["demo-row"]}>
            <ButtonGroup 
              mode="multiple" 
              variant="outlined" 
              size="small"
              segmented={false}
              defaultValue={["active", "pending"]}
            >
              <Button value="all">All</Button>
              <Button value="active">Active</Button>
              <Button value="pending">Pending</Button>
              <Button value="completed">Completed</Button>
              <Button value="archived">Archived</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
