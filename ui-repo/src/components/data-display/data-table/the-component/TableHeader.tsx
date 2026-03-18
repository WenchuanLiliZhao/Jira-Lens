/**
 * DataTable Header Component
 * 
 * Extracted table header rendering logic for independent styling
 */

import React from "react";
import { Icon } from "../../../general/icon";
import type { Column, SortConfig } from "./types";
import styles from "./TableHeader.styles.module.scss";
import { HoverOverlay } from "../../../shared/hover-overlay";

export interface TableHeaderProps<T = unknown> {
  columns: Column<T>[];
  sortBy?: SortConfig;
  onSortChange?: (config: SortConfig) => void;
  stickyHeader?: boolean;
  headerClassName?: string;
  cellVerticalAlign?: 'center' | 'top' | 'bottom';
  getSortIcon: (columnKey: string) => string;
  handleSort: (columnKey: string) => void;
}

export function TableHeader<T = unknown>(props: TableHeaderProps<T>) {
  const {
    columns,
    onSortChange,
    stickyHeader,
    headerClassName,
    cellVerticalAlign = 'center',
    getSortIcon,
    handleSort,
  } = props;

  const headerRowClassName = [
    styles["data-table__header-row"],
    stickyHeader && styles["data-table__header-row--sticky"],
    headerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <thead>
      <tr className={headerRowClassName}>
        {columns.map((column) => {
          const sortEnabled = Boolean(column.sortable && onSortChange);

          const thClassName = [
            styles["data-table__header-cell"],
            column.align && styles[`data-table__header-cell--${column.align}`],
            sortEnabled && styles["data-table__header-cell--sortable"],
            styles[`data-table__header-cell--vertical-${cellVerticalAlign}`],
            column.className,
          ]
            .filter(Boolean)
            .join(" ");

          const headerStyle: React.CSSProperties = {};
          if (column.width) {
            headerStyle.width =
              typeof column.width === "number"
                ? `${column.width}px`
                : column.width;
          }

          return (
            <th
              key={column.key}
              className={thClassName}
              style={headerStyle}
              onClick={sortEnabled ? () => handleSort(column.key) : undefined}
            >
              <div className={styles["data-table__header-content"]}>
                {column.header.content !== undefined ? (
                  column.header.content
                ) : (
                  <>
                    <div className={styles["data-table__header-main"]}>
                      {column.header.icon && (
                        <span
                          className={styles["data-table__header-icon-container"]}
                        >
                          <Icon
                            icon={column.header.icon}
                            className={styles["data-table__header-icon"]}
                          />
                        </span>
                      )}
                      <span className={styles["data-table__header-label"]}>
                        {column.header.label}
                      </span>
                    </div>
                    {sortEnabled && (
                      <div className={styles["data-table__sort-icon-container"]}>
                        <Icon
                          icon={getSortIcon(column.key)}
                          className={styles["data-table__sort-icon"]}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              <HoverOverlay />
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
