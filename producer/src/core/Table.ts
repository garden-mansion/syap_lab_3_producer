import { type MyTableRow } from "../components/utils/types";

interface MyTableProps {
  name: string;
  rowsAmount: number;
  columnsAmount: number;
  headers?: string[];
  table_data?: MyTableRow[];
}

export default class MyTable {
  name: string;
  rowsAmount: number;
  columnsAmount: number;
  headers: string[];
  table_data: MyTableRow[];


  constructor({ name, rowsAmount, columnsAmount, headers, table_data }: MyTableProps) {
    this.name = name;
    this.rowsAmount = rowsAmount;
    this.columnsAmount = columnsAmount;

    if (headers !== undefined) {
      this.headers = headers;
    } else {
      this.headers = this.#initEmptyHeaders();
    }

    if (table_data !== undefined) {
      this.table_data = table_data;
    } else {
      this.table_data = [];
    }
  }

  #initEmptyHeaders() {
    const emptyHeaders: string[] = [];

    for (let i = 0; i < this.columnsAmount; ++i) {
      emptyHeaders.push(`header_${i}`)
    };

    return emptyHeaders;
  }

  initEmptyTable(): undefined {
    const emptyTable: Map<string, string>[] = [];

    for (let i = 0; i < this.rowsAmount; ++i) {
      const rowRecord = new Map<string, string>();

      for (let j = 0; j < this.headers.length; ++j) {
        rowRecord.set(this.headers[j], "");
      }

      emptyTable.push(rowRecord);
    }

    this.table_data = emptyTable;
  }
}