import { Input, TextField } from "@mui/material";
import Table from "../core/Table";
import { type DispatchTableAction } from "../state/table_state";
import NumberField from "./base-ui-components/NumberField";

interface TableSettingsFormProps {
  currentTable: Table;
  dispatchCurrentTable: React.ActionDispatch<[action: DispatchTableAction]>;
}

export default function TableSettingsForm({
  currentTable,
  dispatchCurrentTable,
}: TableSettingsFormProps) {
  const MIN_ROWS_AMOUNT = 1;
  const MAX_ROWS_AMOUNT = 100;
  const DEFAULT_ROWS_AMOUNT = 5;

  const MIN_COLUMNS_AMOUNT = 1;
  const MAX_COLUMNS_AMOUNT = 100;
  const DEFAULT_COLUMNS_AMOUNT = 5;

  return (
    <form className="table-settings-form">
      <div className="table-settings-form__row">
        <TextField
          className="table-settings-form__text-field"
          label="Название таблицы"
          value={currentTable.name}
          onChange={(event) =>
            dispatchCurrentTable({
              type: "rename-table",
              update: { newName: event.target.value, },
            })
          }
        />
      </div>

      <div className="table-settings-form__row">
        <NumberField
          className="table-settings-form__number-field"
          label="Количество строк"
          value={currentTable.rowsAmount}
          onValueChange={(value) =>
            dispatchCurrentTable({
              type: "set-rows-amount",
              update: { newRows: value ?? MIN_ROWS_AMOUNT },
            })
          }
          min={MIN_ROWS_AMOUNT}
          max={MAX_ROWS_AMOUNT}
          size="small"
          defaultValue={DEFAULT_ROWS_AMOUNT}
          // error
        />
      </div>

      <div className="table-settings-form__row">
        <NumberField
          className="table-settings-form__number-field"
          label="Количество столбцов"
          value={currentTable.columnsAmount}
          onValueChange={(value) =>
            dispatchCurrentTable({
              type: "set-columns-amount",
              update: { newColumns: value ?? MIN_COLUMNS_AMOUNT },
            })
          }
          min={MIN_COLUMNS_AMOUNT}
          max={MAX_COLUMNS_AMOUNT}
          size="small"
          defaultValue={DEFAULT_COLUMNS_AMOUNT}
          // error
        />
      </div>

      <div className="table-settings-form__headers-inputs-container">
        {(() => {
          console.log(`текущее количество столбцов: ${currentTable.columnsAmount}`)
          return Array(currentTable.columnsAmount).fill(null).map((_, index) => (
            <TextField
              key={`table-settings-form__header-input-${index}`}
              className="table-settings-form__header-input"
              label={`Заголовок ${index + 1}`}
              value={currentTable.headers[index]}
              onChange={event => 
                dispatchCurrentTable({ type: "set-header", update: { index, value: event.target.value, }})
              }
            />
          ))
        })()}
      </div>
    </form>
  );
}
