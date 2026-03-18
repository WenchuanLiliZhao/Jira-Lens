/**
 * DataTable Group Header Component
 * 
 * Extracted group header rendering logic for independent styling
 */


import { Icon } from "../../../general/icon";
import styles from "./TableGroupHeader.styles.module.scss";

export interface TableGroupHeaderProps {
  groupKey: string;
  groupLabel: string;
  groupIcon?: string;
  rowCount: number;
  isExpanded: boolean;
  colSpan: number;
  onToggle: () => void;
}

export function TableGroupHeader(props: TableGroupHeaderProps) {
  const {
    groupLabel,
    groupIcon,
    rowCount,
    isExpanded,
    colSpan,
    onToggle,
  } = props;

  return (
    <tr
      className={styles['data-table__group-header']}
      onClick={onToggle}
    >
      <td colSpan={colSpan} className={styles['data-table__group-header-cell']}>
        <div className={styles['data-table__group-header-content']}>
          <Icon
            icon={isExpanded ? 'expand_more' : 'chevron_right'}
            className={styles['data-table__group-icon']}
          />
          {groupIcon && (
            <Icon icon={groupIcon} className={styles['data-table__group-label-icon']} />
          )}
          <span className={styles['data-table__group-label']}>{groupLabel}</span>
          <span className={styles['data-table__group-count']}>({rowCount})</span>
        </div>
      </td>
    </tr>
  );
}
