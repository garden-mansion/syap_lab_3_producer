// тип для действия вызываемого с помощью dispatch
// для каждого действия обязательно должен быть указан параметр type - название действия 

import type { MyTableRow } from "../components/utils/types";
import MyTable from "../core/Table";

// необязательный параметр update - дополнительные данные для действия 
export type DispatchTableAction = {
  type: "rename-table" | "set-rows-amount" | "set-columns-amount" | "set-header" | "add-new-row" | "edit-row";
  update: TableNameUpdate | TableCellUpdate | TableRowsUpdate | TableColumnsUpdate | TableHeaderUpdate | TableAddNewRowUpdate | TableEditRowUpdate
};

// ниже указаны возможные типы для параметра update - каждый из типов представляет характер 
// дополнительных данные предоставляемых для reducer'а 
// также функции для проверки, чтобы параметр передаваемый в качестве update'а имел требуемый тип

// тип для параметра update - изменение имени таблицы 
type TableNameUpdate = {
  newName: string;
}

// проверка чтобы передаваемый параметр в reducer'е был типа TableNameUpdate
function isTableNameUpdate(obj: unknown): obj is TableNameUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableNameUpdate = obj as Record<string, unknown>;

  return (
    typeof tableNameUpdate.newName === "string"
  )
}

type TableRowsUpdate = {
  newRows: number;
}

function isTableRowsUpdate(obj: unknown): obj is TableRowsUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableRowsUpdate = obj as Record<string, unknown>;

  return (
    typeof tableRowsUpdate.newRows === "number"
  )
}

type TableColumnsUpdate = {
  newColumns: number;
}

function isTableColumnsUpdate(obj: unknown): obj is TableColumnsUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableColumnsUpdate = obj as Record<string, unknown>;

  return (
    typeof tableColumnsUpdate.newColumns === "number"
  )
}

// тип для параметра update - изменение данных в ячейки таблицы 
type TableCellUpdate = {
  row: number,
  column: number,
  value: string,
}

// проверка чтобы передаваемый параметр в reducer'е был типа TableCellUpdate
function isTableCellUpdate(obj: unknown): obj is TableCellUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableCellUpdate = obj as Record<string, unknown>

  return (
    typeof tableCellUpdate.row === "number" &&
    typeof tableCellUpdate.column === "number" &&
    typeof tableCellUpdate.value === "string"
  )
}

type TableHeaderUpdate = {
  index: number;
  value: string;
}

function isTableHeaderUpdate(obj: unknown): obj is TableHeaderUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableHeaderUpdate = obj as Record<string, unknown>

  return (
    typeof tableHeaderUpdate.index === "number" &&
    typeof tableHeaderUpdate.value === "string"
  )
}

type TableAddNewRowUpdate = {
  newRow: MyTableRow,
}

// не до конца реализована проверка 
function isTableAddNewRowUpdate(obj: unknown): obj is TableAddNewRowUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableAddNewRowUpdate = obj as Record<string, MyTableRow>

  if (!(tableAddNewRowUpdate.newRow instanceof Map)) return false;

  for (const [k, v] of tableAddNewRowUpdate.newRow) {
    if (typeof k !== "string") return false;
    if (typeof v !== "string") return false;
  }

  return true;
}

type TableEditRowUpdate = {
  rowIndex: number,
  newRow: MyTableRow,
}

function isTableEditRowUpdate(obj: unknown): obj is TableEditRowUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableEditRowUpdate = obj as Record<string, number | MyTableRow>

  if (typeof tableEditRowUpdate.rowIndex !== "number") return false;
  if (!(tableEditRowUpdate.newRow instanceof Map)) return false;

  for (const [k, v] of tableEditRowUpdate.newRow) {
    if (typeof k !== "string") return false;
    if (typeof v !== "string") return false;
  }

  return true;
}

export function tableReducer(
  state: MyTable,
  action: DispatchTableAction
): MyTable {
  const { type, update } = action;

  switch (type) {
    case "rename-table": {
      if (!isTableNameUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableNameUpdate`)
      }
      
      return new MyTable({ ...state, name: update.newName,})
    }

    case "set-rows-amount": {
      if (!isTableRowsUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableNameUpdate`);
      }
      
      return new MyTable({ ...state, rowsAmount: update.newRows, });
    }

    case "set-columns-amount": {
      if (!isTableColumnsUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableNameUpdate`);
      }

      let headers = state.headers;
      if (headers.length > update.newColumns) {
        headers = headers.slice(0, update.newColumns);
      } else {
        const oldLength = headers.length;
        
        for (let i = oldLength; i < update.newColumns; ++i) {
          headers.push(`header_${i}`);
        }
      }

      return new MyTable({ ...state, columnsAmount: update.newColumns, headers })
    }

    case "set-header": {
      if (!isTableHeaderUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableHeaderUpdate`)
      }

      const headers = [...state.headers];
      headers[update.index] = update.value;

      return new MyTable({ ...state, headers })
    }

    case "add-new-row": {
      console.log("table_state.ts => adding new row");

      if (!isTableAddNewRowUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableAddNewRowUpdate`)
      }

      const { newRow, } = update;
      console.log(newRow)
      const table_data = structuredClone(state.table_data);
      table_data.push(newRow);
      console.log(table_data)
      return new MyTable({ ...state, rowsAmount: state.rowsAmount + 1, table_data, })
    }

    case "edit-row": {
      console.log("table_state.ts => editing row");

      if (!isTableEditRowUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableEditRowUpdate`);
      }

      const { newRow, rowIndex, } = update;
      console.log(newRow, rowIndex);
      const table_data = [...state.table_data];
      table_data[rowIndex] = newRow;
      console.log(table_data);

      return new MyTable({ ...state, table_data, });
    }

    default: {
      throw new Error(`неизвестный type для reducer'а: ${type}`)
    }
  }
}