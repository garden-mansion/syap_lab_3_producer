import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MyTable from "../core/Table";
import { type DispatchTableAction } from "../state/table_state";
import NumberField from "./base-ui-components/NumberField";
import "../styles/table-settings-form.css";
import { useState } from "react";
import BasicModal from "./base-ui-components/BasicModel";

interface TableSettingsFormProps {
  currentTable: MyTable;
  dispatchCurrentTable: React.ActionDispatch<[action: DispatchTableAction]>;
  setTableEmpty: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TableSettingsForm({
  currentTable,
  dispatchCurrentTable,
  setTableEmpty,
}: TableSettingsFormProps) {
  const MIN_ROWS_AMOUNT = 1;
  const MAX_ROWS_AMOUNT = 100;

  const MIN_COLUMNS_AMOUNT = 1;
  const MAX_COLUMNS_AMOUNT = 100;

  // modal setup
  const [open, setOpen] = useState(false);

  const makeHeadersInputs = () => {
    const headersInputs = Array(currentTable.columnsAmount).fill(null);

    return headersInputs.map((_, index) => (
      <TextField
        key={`table-settings-form__header-input-${index}`}
        className="table-settings-form__header-input"
        name={`table-settings-form__table-header-input-${index}`}
        id={`table-settings-form__table-header-input-${index}`}
        label={`Заголовок ${index + 1}`}
        value={currentTable.headers[index]}
        onChange={(event) =>
          dispatchCurrentTable({
            type: "set-header",
            update: { index, value: event.target.value },
          })
        }
      />
    ));
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputsValues: string[] = [];

    for (const [, value] of formData.entries()) {
      inputsValues.push(value.toString());
    }

    if (inputsValues.some((value) => !value.trim())) {
      setOpen((prevOpen) => !prevOpen);
    } else {
      setTableEmpty((prevTableEmpty) => !prevTableEmpty);
      currentTable.initEmptyTable();
    }
  };

  return (
    <>
      <BasicModal
        open={open}
        setOpen={setOpen}
        title="Ошибка"
        message="не все поля заполнены"
      />
      <form onSubmit={handleOnSubmit} className="table-settings-form">
        <div className="table-settings-form__row ">
          <TextField
            className="table-settings-form__text-field"
            name="table-settings-form__table-name"
            id="table-settings-form__table-name"
            label="Название таблицы"
            value={currentTable.name}
            onChange={(event) =>
              dispatchCurrentTable({
                type: "rename-table",
                update: { newName: event.target.value },
              })
            }
          />
        </div>

        <div className="table-settings-form__row">
          <NumberField
            className="table-settings-form__number-field"
            name="table-settings-form__table-rows-amount"
            id="table-settings-form__table-rows-amount"
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
            // error
          />
        </div>

        <div className="table-settings-form__row">
          <NumberField
            className="table-settings-form__number-field"
            name="table-settings-form__table-columns-amount"
            id="table-settings-form__table-columns-amount"
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
            // error
          />
        </div>

        {/* submit */}
        <div className="table-settings-form__form-row">
          <Button className="table-settings-form__submit-button" type="submit">
            Submit
          </Button>
        </div>

        <div className="table-settings-form__headers-inputs-container">
          {makeHeadersInputs()}
        </div>
      </form>
    </>
  );
}
