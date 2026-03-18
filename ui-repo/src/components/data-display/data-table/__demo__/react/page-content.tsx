import React, { useState, useMemo } from 'react';
import styles from './styles.module.scss';
import { DataTable } from '../../the-component';
import type { Column, SortConfig, TableGroup } from '../../the-component';
import { Icon } from '../../../../general/icon';
import { Label } from '../../../../general/label';
import { chartRainbow, chartNeutral } from '../../../../../global-styles/colors';

/**
 * DataTable Demo Page Content
 * 
 * AI Hint: This is a demo page showcasing all usage patterns of the DataTable component.
 */

// ============ DEMO DATA ============

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  tags: string[];
}

const demoTasks: Task[] = [
  {
    id: 1,
    title: 'Implement DataTable component',
    status: 'done',
    priority: 'high',
    assignee: 'Alice',
    dueDate: '2026-01-31',
    tags: ['frontend', 'react'],
  },
  {
    id: 2,
    title: 'Write documentation',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Bob',
    dueDate: '2026-02-05',
    tags: ['docs'],
  },
  {
    id: 3,
    title: 'Add unit tests',
    status: 'todo',
    priority: 'high',
    assignee: 'Alice',
    dueDate: '2026-02-10',
    tags: ['testing', 'react'],
  },
  {
    id: 4,
    title: 'Design review',
    status: 'done',
    priority: 'low',
    assignee: 'Charlie',
    dueDate: '2026-01-28',
    tags: ['design'],
  },
  {
    id: 5,
    title: 'Performance optimization',
    status: 'todo',
    priority: 'medium',
    assignee: 'Bob',
    dueDate: '2026-02-15',
    tags: ['performance', 'frontend'],
  },
  {
    id: 6,
    title: 'Accessibility audit',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Alice',
    dueDate: '2026-02-08',
    tags: ['a11y', 'frontend'],
  },
  {
    id: 7,
    title: 'API integration',
    status: 'todo',
    priority: 'high',
    assignee: 'Charlie',
    dueDate: '2026-02-12',
    tags: ['backend', 'api'],
  },
  {
    id: 8,
    title: 'User feedback analysis',
    status: 'done',
    priority: 'low',
    assignee: 'Bob',
    dueDate: '2026-01-25',
    tags: ['research'],
  },
];

const PageContent: React.FC = () => {
  // ========== Basic Table State ==========
  const [basicSort, setBasicSort] = useState<SortConfig>({ key: 'id', direction: null });
  
  // ========== Grouped Table State ==========
  const [groupedSort, setGroupedSort] = useState<SortConfig>({ key: 'dueDate', direction: null });
  
  // ========== Sticky Header Table Data ==========
  const longDataList = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 100,
      title: `Task ${i + 100}`,
      status: ['todo', 'in-progress', 'done'][i % 3] as Task['status'],
      priority: ['low', 'medium', 'high'][i % 3] as Task['priority'],
      assignee: ['Alice', 'Bob', 'Charlie'][i % 3],
      dueDate: `2026-02-${String((i % 28) + 1).padStart(2, '0')}`,
      tags: [['frontend'], ['backend'], ['docs', 'testing']][i % 3],
    }));
  }, []);

  // ========== SORTING LOGIC ==========
  
  const sortData = (data: Task[], sortConfig: SortConfig): Task[] => {
    if (!sortConfig.direction) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Task];
      const bValue = b[sortConfig.key as keyof Task];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedBasicData = useMemo(() => sortData(demoTasks, basicSort), [basicSort]);
  
  // ========== GROUPING LOGIC ==========
  
  const groupedData = useMemo((): TableGroup<Task>[] => {
    const grouped: Record<string, Task[]> = {
      todo: [],
      'in-progress': [],
      done: [],
    };
    
    demoTasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    
    const statusLabels: Record<string, string> = {
      todo: 'To Do',
      'in-progress': 'In Progress',
      done: 'Done',
    };
    
    const statusIcons: Record<string, string> = {
      todo: 'radio_button_unchecked',
      'in-progress': 'pending',
      done: 'check_circle',
    };
    
    return Object.entries(grouped).map(([status, rows]) => ({
      groupKey: status,
      groupLabel: statusLabels[status],
      icon: statusIcons[status],
      rows: sortData(rows, groupedSort),
    }));
  }, [groupedSort]);

  // ========== COLUMN DEFINITIONS ==========
  
  const basicColumns: Column<Task>[] = [
    {
      key: 'id',
      header: { label: 'ID', icon: 'tag' },
      accessor: 'id',
      sortable: true,
      width: 80,
      align: 'center',
    },
    {
      key: 'title',
      header: { label: 'Title' },
      accessor: 'title',
      sortable: true,
    },
    {
      key: 'status',
      header: { label: 'Status' },
      accessor: 'status',
      sortable: true,
      cellRenderer: (value) => {
        const statusValue = value as string;
        const statusConfig: Record<string, { label: string; icon: string; textColor: string; bgColor: string }> = {
          todo: {
            label: 'To Do',
            icon: 'radio_button_unchecked',
            textColor: chartNeutral['7'],
            bgColor: chartNeutral['2'],
          },
          'in-progress': {
            label: 'In Progress',
            icon: 'pending',
            textColor: chartRainbow['blue-100'],
            bgColor: chartRainbow['blue-20'],
          },
          done: {
            label: 'Done',
            icon: 'check_circle',
            textColor: chartRainbow['green-100'],
            bgColor: chartRainbow['green-20'],
          },
        };
        const config = statusConfig[statusValue];
        return (
          <Label
            size="small"
            startIcon={config.icon}
            endIcon="cancel"
            textColor={config.textColor}
            backgroundColor={config.bgColor}
          >
            {config.label}
          </Label>
        );
      },
    },
    {
      key: 'priority',
      header: { label: 'Priority', icon: 'flag' },
      accessor: 'priority',
      sortable: true,
      cellRenderer: (value) => {
        const priorityValue = value as string;
        const priorityConfig: Record<string, { textColor: string; bgColor: string }> = {
          low: {
            textColor: 'var(--chart-black-alpha-40-hex)',
            bgColor: 'var(--chart-black-alpha-4-hex)',
          },
          medium: {
            textColor: 'var(--chart-rainbow-orange-100)',
            bgColor: 'var(--chart-rainbow-orange-20)',
          },
          high: {
            textColor: 'var(--chart-rainbow-red-100)',
            bgColor: 'var(--chart-rainbow-red-20)',
          },
        };
        const config = priorityConfig[priorityValue];
        return (
          <Label
            size="small"
            startIcon="flag"
            endIcon="cancel"
            textColor={config.textColor}
            backgroundColor={config.bgColor}
          >
            {priorityValue.charAt(0).toUpperCase() + priorityValue.slice(1)}
          </Label>
        );
      },
    },
    {
      key: 'assignee',
      header: { label: 'Assignee', icon: 'person' },
      accessor: 'assignee',
      sortable: true,
    },
    {
      key: 'dueDate',
      header: { label: 'Due Date', icon: 'event' },
      accessor: 'dueDate',
      sortable: true,
    },
  ];

  const tagsColumn: Column<Task> = {
    key: 'tags',
    header: { label: 'Tags', icon: 'label' },
    accessor: 'tags',
    cellRenderer: (value) => {
      const tags = value as string[];
      return (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Label
            key={tag}
            size="small"
            startIcon="label"
            endIcon="cancel"
          >
            {tag}
          </Label>
        ))}
      </div>
      );
    },
  };

  const columnsWithTags = [...basicColumns, tagsColumn];

  const groupedColumns: Column<Task>[] = [
    {
      key: 'title',
      header: { label: 'Task' },
      accessor: 'title',
      sortable: true,
    },
    {
      key: 'priority',
      header: { label: 'Priority' },
      accessor: 'priority',
      sortable: true,
      cellRenderer: (value) => {
        const priorityValue = value as string;
        const priorityConfig: Record<string, { textColor: string; bgColor: string }> = {
          low: {
            textColor: chartNeutral['7'],
            bgColor: chartNeutral['2'],
          },
          medium: {
            textColor: chartRainbow['orange-100'],
            bgColor: chartRainbow['orange-20'],
          },
          high: {
            textColor: chartRainbow['red-100'],
            bgColor: chartRainbow['red-20'],
          },
        };
        const config = priorityConfig[priorityValue];
        return (
          <Label
            size="small"
            startIcon="flag"
            endIcon="cancel"
            textColor={config.textColor}
            backgroundColor={config.bgColor}
          >
            {priorityValue.charAt(0).toUpperCase() + priorityValue.slice(1)}
          </Label>
        );
      },
    },
    {
      key: 'assignee',
      header: { label: 'Assignee' },
      accessor: 'assignee',
      sortable: true,
    },
    {
      key: 'dueDate',
      header: { label: 'Due Date' },
      accessor: 'dueDate',
      sortable: true,
    },
  ];

  return (
    <div className={styles['component-demo-container']}>
      <h1>DataTable Component Demo</h1>
      
      {/* Basic Table */}
      <section className={styles['component-demo-section']}>
        <h2>Basic Table with Sorting</h2>
        <p>Click on column headers to sort. The table uses a controlled sorting approach.</p>
        
        <DataTable
          data={sortedBasicData}
          columns={basicColumns}
          sortBy={basicSort}
          onSortChange={setBasicSort}
          stickyHeader
          rowKey="id"
        />
      </section>

      {/* Custom Cell Renderers */}
      <section className={styles['component-demo-section']}>
        <h2>Custom Cell Renderers</h2>
        <p>Cells can contain any React content - badges, icons, complex components, etc.</p>
        
        <DataTable
          data={sortedBasicData.slice(0, 5)}
          columns={columnsWithTags}
          sortBy={basicSort}
          onSortChange={setBasicSort}
          rowKey="id"
        />
      </section>

      {/* Grouped Data */}
      <section className={styles['component-demo-section']}>
        <h2>Grouped Data</h2>
        <p>Data grouped by status. Click on group headers to expand/collapse.</p>
        
        <DataTable
          data={groupedData}
          columns={groupedColumns}
          isGrouped
          defaultExpandedGroups={['todo', 'in-progress', 'done']}
          sortBy={groupedSort}
          onSortChange={setGroupedSort}
          rowKey="id"
        />
      </section>

      {/* Sticky Header */}
      <section className={styles['component-demo-section']}>
        <h2>Sticky Header (Scroll to See)</h2>
        <p>Table with sticky header that stays at the top while scrolling.</p>
        
        <div>
          <DataTable
            data={longDataList}
            columns={basicColumns}
            stickyHeader
            maxHeight="400px"
            rowKey="id"
          />
        </div>
      </section>

      {/* Visual Variants */}
      <section className={styles['component-demo-section']}>
        <h2>Visual Variants</h2>
        
        <h3>Striped Rows</h3>
        <DataTable
          data={sortedBasicData.slice(0, 5)}
          columns={basicColumns.slice(0, 4)}
          striped
          rowKey="id"
        />
        
        <h3>Without Borders</h3>
        <DataTable
          data={sortedBasicData.slice(0, 5)}
          columns={basicColumns.slice(0, 4)}
          bordered={false}
          rowKey="id"
        />
        
        <h3>No Hover Effect</h3>
        <DataTable
          data={sortedBasicData.slice(0, 5)}
          columns={basicColumns.slice(0, 4)}
          hoverable={false}
          rowKey="id"
        />
      </section>

      {/* Clickable Rows */}
      <section className={styles['component-demo-section']}>
        <h2>Clickable Rows</h2>
        <p>Click on any row to see the alert.</p>
        
        <DataTable
          data={sortedBasicData.slice(0, 5)}
          columns={basicColumns.slice(0, 4)}
          onRowClick={(row) => alert(`Clicked: ${row.title}`)}
          rowKey="id"
        />
      </section>

      {/* Horizontal Scroll */}
      <section className={styles['component-demo-section']}>
        <h2>Horizontal Scroll</h2>
        <p>Tables with horizontal scrolling enabled for wide content.</p>
        
        <h3>Auto Width with Horizontal Scroll</h3>
        <p>Table width is based on content. Resize your window to see horizontal scrolling.</p>
        <div style={{ maxWidth: '600px', border: '2px solid var(--use-border-secondary)' }}>
          <DataTable
            data={sortedBasicData.slice(0, 5)}
            columns={columnsWithTags}
            tableWidth="auto"
            horizontalScroll
            rowKey="id"
          />
        </div>
        
        <h3>Fixed Width with Horizontal Scroll</h3>
        <p>Table has a fixed width of 1200px, scrolls horizontally in smaller containers.</p>
        <div style={{ maxWidth: '600px', border: '2px solid var(--use-border-secondary)' }}>
          <DataTable
            data={sortedBasicData.slice(0, 5)}
            columns={basicColumns}
            tableWidth="1200px"
            horizontalScroll
            rowKey="id"
          />
        </div>
        
        <h3>Both Horizontal and Vertical Scroll</h3>
        <p>Combination of horizontal scroll (wide content) and vertical scroll (maxHeight).</p>
        <div style={{ maxWidth: '600px', border: '2px solid var(--use-border-secondary)' }}>
          <DataTable
            data={longDataList.slice(0, 20)}
            columns={columnsWithTags}
            tableWidth="auto"
            horizontalScroll
            maxHeight="300px"
            stickyHeader
            rowKey="id"
          />
        </div>
        
        <h3>Full Width (Default - No Horizontal Scroll)</h3>
        <p>Default behavior: table fills container, columns auto-adjust (no horizontal scroll).</p>
        <div style={{ maxWidth: '600px', border: '2px solid var(--use-border-secondary)' }}>
          <DataTable
            data={sortedBasicData.slice(0, 5)}
            columns={columnsWithTags}
            rowKey="id"
          />
        </div>
      </section>

      {/* Empty State */}
      <section className={styles['component-demo-section']}>
        <h2>Empty State</h2>
        <p>Table with no data shows an empty state.</p>
        
        <DataTable
          data={[]}
          columns={basicColumns}
          rowKey="id"
        />
        
        <h3>Custom Empty State</h3>
        <DataTable
          data={[]}
          columns={basicColumns}
          rowKey="id"
          emptyContent={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '3em', opacity: 0.5 }}>
                <Icon icon="sentiment_satisfied" />
              </div>
              <p style={{ margin: '12px 0 0', color: '#999' }}>
                No tasks yet! Start by creating your first task.
              </p>
            </div>
          }
        />
      </section>
    </div>
  );
};

export default PageContent;
