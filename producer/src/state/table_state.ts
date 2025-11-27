// тип для действия вызываемого с помощью dispatch
// для каждого действия обязательно должен быть указан параметр type - название действия 

import Table from "../core/Table";

// необязательный параметр update - дополнительные данные для действия 
export type DispatchTableAction = {
  type: "rename-table" | "set-rows-amount" | "set-columns-amount" | "set-header";
  update?: TableNameUpdate | TableCellUpdate | TableRowsUpdate | TableColumnsUpdate | TableHeaderUpdate
};

// ниже указаны возможные типы для параметра update - каждый из типов представляет характер 
// дополнительных данные предоставляемых для reducer'а 
// также функции для проверки, чтобы параметр передаваемый в качестве update'а имел требуемый тип

// тип для параметра update - изменение имени таблицы 
export type TableNameUpdate = {
  newName: string;
}

// проверка чтобы передаваемый параметр в reducer'е был типа TableNameUpdate
export function isTableNameUpdate(obj: unknown): obj is TableNameUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableNameUpdate = obj as Record<string, unknown>;

  return (
    typeof tableNameUpdate.newName === "string"
  )
}

export type TableRowsUpdate = {
  newRows: number;
}

export function isTableRowsUpdate(obj: unknown): obj is TableRowsUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableRowsUpdate = obj as Record<string, unknown>;

  return (
    typeof tableRowsUpdate.newRows === "number"
  )
}

export type TableColumnsUpdate = {
  newColumns: number;
}

export function isTableColumnsUpdate(obj: unknown): obj is TableColumnsUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableColumnsUpdate = obj as Record<string, unknown>;

  return (
    typeof tableColumnsUpdate.newColumns === "number"
  )
}

// тип для параметра update - изменение данных в ячейки таблицы 
export type TableCellUpdate = {
  row: number,
  column: number,
  value: string,
}

// проверка чтобы передаваемый параметр в reducer'е был типа TableCellUpdate
export function isTableCellUpdate(obj: unknown): obj is TableCellUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableCellUpdate = obj as Record<string, unknown>

  return (
    typeof tableCellUpdate.row === "number" &&
    typeof tableCellUpdate.column === "number" &&
    typeof tableCellUpdate.value === "string"
  )
}

export type TableHeaderUpdate = {
  index: number;
  value: string;
}

export function isTableHeaderUpdate(obj: unknown): obj is TableHeaderUpdate {
  if (typeof obj !== "object" || obj === null) return false;

  const tableHeaderUpdate = obj as Record<string, unknown>

  return (
    typeof tableHeaderUpdate.index === "number" &&
    typeof tableHeaderUpdate.value === "string"
  )
}

export function tableReducer(
  state: Table,
  action: DispatchTableAction
): Table {
  const { type, update } = action;

  switch (type) {
    case "rename-table": {
      console.log("renaming table");
      if (update === undefined) {
        throw new Error("свойство update не определено для задания названия таблицы!");
      }

      if (!isTableNameUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableNameUpdate\ntype=${type}`)
      }
      
      return new Table({ ...state, name: update.newName,})
    }

    case "set-rows-amount": {
      console.log("set-rows-amount")
      if (update === undefined) {
        throw new Error("свойство update не определено для задания количества строк!");
      }

      if (!isTableRowsUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableNameUpdate\ntype=${type}`);
      }
      
      return new Table({ ...state, rowsAmount: update.newRows, });
    }

    case "set-columns-amount": {
      if (update === undefined) {
        throw new Error("свойство update не определено для задания количества столбцов!");
      }

      if (!isTableColumnsUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableNameUpdate\ntype=${type}`);
      }

      return new Table({ ...state, columnsAmount: update.newColumns, })
    }

    case "set-header": {
      if (update === undefined) {
        throw new Error("свойство update не определено для задания заголовка!");
      }

      if (!isTableHeaderUpdate(update)) {
        throw new Error(`при type=${type} update должен быть типа TableHeaderUpdate\ntype=${type}`)
      }

      const headers = [...state.headers];
      headers[update.index] = update.value;

      return new Table({ ...state, headers })
    }

    default: {
      throw new Error(`неизвестный type для reducer'а: ${type}`)
    }
  }
}