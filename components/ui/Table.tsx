"use client";

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type SortDirection = 'asc' | 'desc';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  render?: (row: T) => ReactNode;
}

export interface TableProps<T extends Record<string, unknown>> {
  columns: Array<TableColumn<T>>;
  data: T[];
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string | undefined);
  emptyState?: ReactNode;
  initialSortKey?: keyof T;
  initialSortDirection?: SortDirection;
}

function compareValues(left: unknown, right: unknown) {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;

  if (typeof left === 'number' && typeof right === 'number') return left - right;
  if (typeof left === 'boolean' && typeof right === 'boolean') return Number(left) - Number(right);

  const leftDate = left instanceof Date ? left.getTime() : Number.NaN;
  const rightDate = right instanceof Date ? right.getTime() : Number.NaN;

  if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate)) {
    return leftDate - rightDate;
  }

  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  className,
  rowClassName,
  emptyState = 'No records available.',
  initialSortKey,
  initialSortDirection = 'asc',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSortKey ?? null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortKey ? initialSortDirection : 'asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    const column = columns.find((item) => item.key === sortKey);

    if (!column?.sortable) return data;

    return [...data].sort((leftRow, rightRow) => {
      const comparison = compareValues(leftRow[sortKey], rightRow[sortKey]);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [columns, data, sortDirection, sortKey]);

  const handleSort = (key: keyof T) => {
    const column = columns.find((item) => item.key === key);

    if (!column?.sortable) return;

    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-neutral-200 bg-[#fbf8f2] shadow-[0_24px_70px_rgba(51,43,34,0.05)]', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-[#f3eee5]">
            <tr>
              {columns.map((column) => {
                const active = sortKey === column.key;

                return (
                  <th
                    key={String(column.key)}
                    scope="col"
                    className={cn(
                      'px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.3em] text-[#8d8374]',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.headerClassName,
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className={cn(
                        'inline-flex items-center gap-2 transition-colors',
                        column.sortable ? 'cursor-pointer hover:text-[#4d463d]' : 'cursor-default',
                        column.align === 'center' && 'justify-center',
                        column.align === 'right' && 'justify-end',
                      )}
                      disabled={!column.sortable}
                    >
                      <span>{column.label}</span>
                      {column.sortable ? (
                        active ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                        )
                      ) : null}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-[#fbf8f2]">
            {sortedData.length ? (
              sortedData.map((row, rowIndex) => {
                const resolvedRowClassName = typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName;

                return (
                  <tr key={rowIndex} className={cn('transition-colors hover:bg-[#f4efe6]/80', resolvedRowClassName)}>
                    {columns.map((column) => {
                      const content = column.render ? column.render(row) : (row[column.key] as ReactNode);

                      return (
                        <td
                          key={String(column.key)}
                          className={cn(
                            'px-6 py-5 align-middle text-sm text-[#3b342c]',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right',
                            column.cellClassName,
                          )}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-[#8d8374]" colSpan={columns.length}>
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}