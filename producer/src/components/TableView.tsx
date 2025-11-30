import { useMemo } from "react";
import type MyTable from "../core/Table";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import Button from "@mui/material/Button";
import type { MyTableRow } from "./utils/types";
import type { DispatchTableAction } from "../state/table_state";

interface TableViewProps {
  currentTable: MyTable;
  setTableEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  dispatchCurrentTable: React.ActionDispatch<[action: DispatchTableAction]>;
}

export default function TableView({
  currentTable,
  dispatchCurrentTable,
}: TableViewProps) {
  const headers = currentTable.headers;
  const data = useMemo(
    () =>
      currentTable.table_data.map((rowMap) => {
        const obj: Record<string, string> = {};
        for (const header of headers) {
          // если MyTableRow = Map<string, string>
          obj[header] = rowMap.get(header) ?? "";
        }
        return obj;
      }),
    [currentTable.table_data, headers]
  );
  const columns = useMemo(
    () =>
      headers.map((header) => ({
        header,
        accessorKey: header,
      })),
    [headers]
  );

  const table = useMaterialReactTable({
    // колонки и данные таблицы
    columns,
    data,

    // управление редактирование данных в таблице
    enableEditing: true,
    editDisplayMode: "modal",
    onEditingRowSave: ({ table, values, row, }) => {
      console.log("in onEditingRowSave");
      console.log(row.index);
      const newRow: MyTableRow = new Map<string, string>();

      for (const header of currentTable.headers) {
        newRow.set(header, String(values[header]) ?? "");
      }
      console.log(newRow);

      dispatchCurrentTable({
        type: "edit-row",
        update: { rowIndex: row.index, newRow },
      });
      // exitEditingMode();
      table.setEditingRow(null);
    },
    // onEditingRowCancel: ({ row, table, }) => {
    //   console.log("onEditingRowCancel");
    //   console.log(row, table);
    // },

    enableRowSelection: true,
    enableColumnOrdering: true,
    enableGlobalFilter: false, // на счет этого не уверен

    // добавление строк
    createDisplayMode: "modal",
    positionCreatingRow: "bottom",
    onCreatingRowSave: ({ table, values }) => {
      //validate data
      // no validation yet

      // save data to api
      let newRow: MyTableRow = new Map<string, string>();
      for (const forHeader in values) {
        const cellValue = values[forHeader];
        newRow.set(forHeader, cellValue);
      }
      console.log("new row: ", newRow);
      dispatchCurrentTable({ type: "add-new-row", update: { newRow } });

      table.setCreatingRow(null); //exit creating mode
    },
    // onCreatingRowCancel: () => {
    //   // clear any validation errors
    // },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Button
          onClick={() => {
            table.setCreatingRow(true); //simplest way to open the create row modal with no default values
            //or you can pass in a row object to set default values with the `createRow` helper function
            // table.setCreatingRow(
            //   createRow(table, {
            //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
            //   }),
            // );
          }}
        >
          Создать запись
        </Button>
      );
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
}
