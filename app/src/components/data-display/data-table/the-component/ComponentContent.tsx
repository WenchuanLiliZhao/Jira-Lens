/**
 * DataTableContent - Content Rendering Logic
 */

import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import type { DataTableContentProps, Column, TableGroup } from './types';
import { Icon } from '../../../general/icon';
import { TableGroupHeader } from './TableGroupHeader';

export function DataTableContent<T = unknown>(props: DataTableContentProps<T>) {
  const {
    data,
    columns,
    isGrouped,
    expandedGroups,
    toggleGroup,
    rowClassName,
    onRowClick,
    rowKey,
    emptyContent,
    cellVerticalAlign = 'center',
  } = props;

  // Get value from row using column accessor
  const getCellValue = (column: Column<T>, row: T): unknown => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor as keyof T];
  };

  // Render a single cell
  const renderCell = (column: Column<T>, row: T, rowIndex: number) => {
    const value = getCellValue(column, row);
    
    const tdClassName = [
      styles['data-table__cell'],
      column.align && styles[`data-table__cell--${column.align}`],
      styles[`data-table__cell--vertical-${cellVerticalAlign}`],
      column.className,
    ]
      .filter(Boolean)
      .join(' ');

    const cellStyle: React.CSSProperties = {};
    if (column.width) {
      cellStyle.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
    }

    return (
      <td key={column.key} className={tdClassName} style={cellStyle}>
        {column.cellRenderer
          ? column.cellRenderer(value, row, rowIndex)
          : (value as React.ReactNode)}
      </td>
    );
  };

  // Get row key
  const getRowKey = (row: T, rowIndex: number): string | number => {
    if (!rowKey) {
      return rowIndex;
    }
    if (typeof rowKey === 'function') {
      return rowKey(row, rowIndex);
    }
    return row[rowKey as keyof T] as string | number;
  };

  // Render a single row
  const renderRow = (row: T, rowIndex: number) => {
    const key = getRowKey(row, rowIndex);
    
    const trClassName = [
      styles['data-table__row'],
      onRowClick && styles['data-table__row--clickable'],
      typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <tr
        key={key}
        className={trClassName}
        onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
      >
        {columns.map((column) => renderCell(column, row, rowIndex))}
      </tr>
    );
  };

  // Render grouped data
  const renderGroupedData = () => {
    const groups = data as TableGroup<T>[];

    return groups.map((group) => {
      const isExpanded = expandedGroups.has(group.groupKey);
      
      return (
        <Fragment key={group.groupKey}>
          <TableGroupHeader
            groupKey={group.groupKey}
            groupLabel={group.groupLabel}
            groupIcon={group.icon}
            rowCount={group.rows.length}
            isExpanded={isExpanded}
            colSpan={columns.length}
            onToggle={() => toggleGroup(group.groupKey)}
          />
          {isExpanded && group.rows.map((row, index) => renderRow(row, index))}
        </Fragment>
      );
    });
  };

  // Render flat data
  const renderFlatData = () => {
    const rows = data as T[];
    return rows.map((row, index) => renderRow(row, index));
  };

  // Render empty state
  const renderEmptyState = () => {
    const defaultEmptyContent = (
      <div className={styles['data-table__empty']}>
        <Icon icon="inbox" className={styles['data-table__empty-icon']} />
        <p className={styles['data-table__empty-text']}>No data available</p>
      </div>
    );

    return (
      <tr>
        <td colSpan={columns.length} className={styles['data-table__empty-cell']}>
          {emptyContent || defaultEmptyContent}
        </td>
      </tr>
    );
  };

  // Check if data is empty
  const isEmpty = () => {
    if (!data || data.length === 0) {
      return true;
    }
    if (isGrouped) {
      const groups = data as TableGroup<T>[];
      return groups.every((group) => group.rows.length === 0);
    }
    return false;
  };

  return (
    <tbody>
      {isEmpty()
        ? renderEmptyState()
        : isGrouped
        ? renderGroupedData()
        : renderFlatData()}
    </tbody>
  );
}
