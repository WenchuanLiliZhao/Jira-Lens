/**
 * DataTable Component - Main Implementation
 */

import React, { useState } from "react";
import styles from "./styles.module.scss";
import type { DataTableProps } from "./types";
import { DataTableContent } from "./ComponentContent";
import { TableHeader } from "./TableHeader";

function DataTableComponent<T = unknown>(props: DataTableProps<T>) {
  const {
    data,
    columns,
    sortBy,
    onSortChange,
    isGrouped = false,
    defaultExpandedGroups = [],
    onGroupToggle,
    stickyHeader = false,
    maxHeight,
    fontSize = 'default',
    cellVerticalAlign = 'center',
    bordered = true,
    hoverable = true,
    striped = false,
    horizontalScroll = false,
    tableWidth = 'full',
    className,
    rowClassName,
    headerClassName,
    emptyContent,
    onRowClick,
    rowKey,
  } = props;

  // Manage expanded groups for grouped tables
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(defaultExpandedGroups),
  );

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }

      // Notify parent if callback provided
      if (onGroupToggle) {
        onGroupToggle(groupKey, !prev.has(groupKey));
      }

      return newSet;
    });
  };

  // Handle sort click
  const handleSort = (columnKey: string) => {
    if (!onSortChange) return;

    let newDirection: "asc" | "desc" | null = "asc";

    if (sortBy?.key === columnKey) {
      if (sortBy.direction === "asc") {
        newDirection = "desc";
      } else if (sortBy.direction === "desc") {
        newDirection = null;
      }
    }

    onSortChange({
      key: columnKey,
      direction: newDirection,
    });
  };

  // Get sort icon for a column
  const getSortIcon = (columnKey: string): string => {
    if (sortBy?.key !== columnKey || sortBy.direction === null) {
      return "unfold_more"; // Unsorted
    }
    return sortBy.direction === "asc" ? "arrow_upward" : "arrow_downward";
  };

  // Build table className
  const tableClassName = [
    styles["data-table"],
    bordered && styles["data-table--bordered"],
    hoverable && styles["data-table--hoverable"],
    striped && styles["data-table--striped"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Build table style for width control
  const tableStyle: React.CSSProperties = {};
  if (tableWidth !== 'full') {
    if (tableWidth === 'auto') {
      tableStyle.width = 'auto';
    } else {
      tableStyle.width = typeof tableWidth === 'number' 
        ? `${tableWidth}px` 
        : tableWidth;
    }
  }


  // Build container style
  const containerStyle: React.CSSProperties = {};
  if (maxHeight) {
    containerStyle.maxHeight =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
    containerStyle.overflowY = "auto";
  }

  // Build container className
  const containerClassName = [
    styles["data-table-container"],
    horizontalScroll && styles["data-table-container--horizontal-scroll"],
    maxHeight && styles["data-table-container--vertical-scroll"],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClassName}
      style={containerStyle}
      data-font-size={fontSize !== 'default' ? fontSize : undefined}
    >
      <table className={tableClassName} style={tableStyle}>
        <TableHeader
          columns={columns}
          sortBy={sortBy}
          onSortChange={onSortChange}
          stickyHeader={stickyHeader}
          headerClassName={headerClassName}
          cellVerticalAlign={cellVerticalAlign}
          getSortIcon={getSortIcon}
          handleSort={handleSort}
        />
        <DataTableContent
          data={data}
          columns={columns}
          isGrouped={isGrouped}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
          rowClassName={rowClassName}
          onRowClick={onRowClick}
          rowKey={rowKey}
          emptyContent={emptyContent}
          cellVerticalAlign={cellVerticalAlign}
        />
      </table>
    </div>
  );
}

// Export with proper typing
export const DataTable = DataTableComponent as <T = unknown>(
  props: DataTableProps<T>,
) => React.ReactElement;
