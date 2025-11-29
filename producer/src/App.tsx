import { useReducer, useState } from "react";
import Table from "./core/Table";
import TableSettingsForm from "./components/TableSettingsForm";
import TableView from "./components/TableView";
import { tableReducer } from "./state/table_state";
import "./styles/global.css"

export default function App() {
  const [tableState, dispatchTable] = useReducer(
    tableReducer,
    new Table({ name: "", rowsAmount: 2, columnsAmount: 5 })
  );
  const [tableEmpty, setTableEmpty] = useState(true);

  return (
    <div id="app">
      {
        tableEmpty ?
        <TableSettingsForm setTableEmpty={setTableEmpty} currentTable={tableState} dispatchCurrentTable={dispatchTable} /> :
        <TableView currentTable={tableState} setTableEmpty={setTableEmpty} />
      }
    </div>
  );
}
