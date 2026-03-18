/**
 * DataTable Component Types
 */

import React from 'react';

// ============ COLUMN TYPES ============

export interface ColumnHeader {
  /** Column header label */
  label: string;
  /** Optional icon for the header */
  icon?: string;
  /** Optional custom content; when provided, renders instead of label+icon */
  content?: React.ReactNode;
}

export interface Column<T = unknown> {
  /** Unique column key */
  key: string;
  
  /** Header configuration */
  header: ColumnHeader;
  
  /** Data accessor - key or function to get value from row */
  accessor: keyof T | ((row: T) => unknown);
  
  /** Whether this column is sortable */
  sortable?: boolean;
  
  /** Custom cell renderer */
  cellRenderer?: (value: unknown, row: T, rowIndex: number) => React.ReactNode;
  
  /** Column width (CSS value) */
  width?: string | number;
  
  /** Cell content alignment */
  align?: 'left' | 'center' | 'right';
  
  /** Custom class name for column cells */
  className?: string;
}

// ============ SORTING TYPES ============

export interface SortConfig {
  /** Column key being sorted */
  key: string;
  /** Sort direction (null = unsorted) */
  direction: 'asc' | 'desc' | null;
}

// ============ GROUPING TYPES ============

export interface TableGroup<T = unknown> {
  /** Unique group identifier */
  groupKey: string;
  /** Display label for the group */
  groupLabel: string;
  /** Rows in this group */
  rows: T[];
  /** Optional icon for group header */
  icon?: string;
}

// ============ MAIN COMPONENT PROPS ============

export interface DataTableProps<T = unknown> {
  // ========== Data ==========
  
  /** Table data - either flat array or grouped array */
  data: T[] | TableGroup<T>[];
  
  /** Column definitions */
  columns: Column<T>[];
  
  // ========== Sorting ==========
  
  /** Current sort configuration (controlled) */
  sortBy?: SortConfig;
  
  /** Callback when sort changes */
  onSortChange?: (config: SortConfig) => void;
  
  // ========== Grouping ==========
  
  /** Whether data is grouped */
  isGrouped?: boolean;
  
  /** Default expanded group keys */
  defaultExpandedGroups?: string[];
  
  /** Callback when group is toggled */
  onGroupToggle?: (groupKey: string, expanded: boolean) => void;
  
  // ========== UI Configuration ==========

  /** Font size variant for dense display contexts. 'small' reduces font to 12px with tighter padding. */
  fontSize?: 'default' | 'small';

  /**
   * Vertical alignment of table cell content.
   * - 'center' (default): content vertically centered
   * - 'top': content aligned to top
   * - 'bottom': content aligned to bottom
   */
  cellVerticalAlign?: 'center' | 'top' | 'bottom';

  /** Whether header should stick to top while scrolling */
  stickyHeader?: boolean;
  
  /** Maximum height for the table (enables vertical scrolling with sticky header) */
  maxHeight?: string | number;
  
  /** Whether to show borders between cells */
  bordered?: boolean;
  
  /** Whether to show hover effect on rows */
  hoverable?: boolean;
  
  /** Whether to show striped rows */
  striped?: boolean;
  
  // ========== Layout & Scrolling ==========
  
  /** Enable horizontal scrolling when content overflows */
  horizontalScroll?: boolean;
  
  /** Table width behavior
   * - 'full' (default): width 100%, columns auto-adjust to fit container
   * - 'auto': width based on content, may trigger horizontal scroll
   * - specific value: e.g. '1200px' or 1200
   */
  tableWidth?: 'full' | 'auto' | string | number;
  
  // ========== Styling ==========
  
  /** Custom class name for the table container */
  className?: string;
  
  /** Custom class name for rows (can be function for dynamic classes) */
  rowClassName?: string | ((row: T, rowIndex: number) => string);
  
  /** Custom class name for header row */
  headerClassName?: string;
  
  // ========== Empty State ==========
  
  /** Custom empty state content */
  emptyContent?: React.ReactNode;
  
  // ========== Row Props ==========
  
  /** Callback when row is clicked */
  onRowClick?: (row: T, rowIndex: number) => void;
  
  /** Function to get unique row key */
  rowKey?: keyof T | ((row: T, rowIndex: number) => string | number);
}

// ============ INTERNAL COMPONENT PROPS ============

export interface DataTableContentProps<T = unknown> {
  /** Table data */
  data: T[] | TableGroup<T>[];
  
  /** Column definitions */
  columns: Column<T>[];
  
  /** Whether data is grouped */
  isGrouped: boolean;
  
  /** Expanded group keys */
  expandedGroups: Set<string>;
  
  /** Toggle group expansion */
  toggleGroup: (groupKey: string) => void;
  
  /** Row class name */
  rowClassName?: string | ((row: T, rowIndex: number) => string);
  
  /** Row click handler */
  onRowClick?: (row: T, rowIndex: number) => void;
  
  /** Function to get unique row key */
  rowKey?: keyof T | ((row: T, rowIndex: number) => string | number);
  
  /** Empty state content */
  emptyContent?: React.ReactNode;

  /** Vertical alignment of table cell content */
  cellVerticalAlign?: 'center' | 'top' | 'bottom';
}
