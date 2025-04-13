import { ReactNode } from "react";
import { css } from "@emotion/react";

export type ColDef<RowModel extends ValidRowModel = ValidRowModel> = {
  field: keyof RowModel;
  name: ReactNode;
  width?: number;
};

export type ValidRowModel = Record<string, ReactNode>;

export const Table = <RowModel extends ValidRowModel = ValidRowModel>({
  columns,
  rows,
  onRowClick,
}: {
  columns: ColDef<RowModel>[];
  rows: RowModel[];
  onRowClick?: (row: RowModel) => void;
}) => {
  return (
    <div css={rootStyles}>
      <div css={headerStyles}>
        <div css={headerRowStyles}>
          {columns.map((column, i) => (
            <div
              style={{
                width: column.width || 100,
              }}
              css={headerCellStyles}
              key={i}
            >
              {column.name}
            </div>
          ))}
        </div>
      </div>
      <div css={bodyStyles}>
        {rows.map((row, index) => (
          <div
            css={bodyRowStyles}
            key={index}
            onClick={() => {
              onRowClick?.(row);
            }}
          >
            {columns.map((column, index) => (
              <div
                style={{
                  width: column.width || 100,
                }}
                css={bodyCellStyles}
                key={index}
              >
                {row[column.field]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const rootStyles = css`
  border: 1px solid var(--border-color);
`;
const headerStyles = css``;
const bodyStyles = css``;
const headerRowStyles = css`
  display: flex;
`;
const bodyRowStyles = css`
  display: flex;
  border-top: 1px solid var(--border-color);
  cursor: pointer;
`;
const bodyCellStyles = css`
  padding: 2px 8px;
  font-size: 12px;
  border-right: 1px solid var(--border-color);
`;
const headerCellStyles = css`
  border-right: 1px solid var(--border-color);
  padding: 8px;
  font-size: 13px;
`;
