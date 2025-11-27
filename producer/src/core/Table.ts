interface TableModelProps {
  name: string;
  rowsAmount: number;
  columnsAmount: number;
  headers?: string[];
  table_data?: string[][];
}

export default class Table {
  name: string;
  rowsAmount: number;
  columnsAmount: number;
  headers: string[];
  table_data: string[][];
  

  constructor({ name, rowsAmount, columnsAmount, headers, table_data }: TableModelProps) {
    this.name = name;
    this.rowsAmount = rowsAmount;
    this.columnsAmount = columnsAmount;

    if (headers !== undefined) {
      this.headers = headers;
    } else {
      this.headers = Array(columnsAmount).fill("");
    }

    if (table_data !== undefined) {
      this.table_data = table_data;
    } else {
      this.table_data = [];

      for (let i = 0; i < this.rowsAmount; ++i) {
        this.table_data.push([]);
  
        for (let j = 0; j < this.columnsAmount; ++j) {
          this.table_data[i].push("");
        }
      } 
    }
  }

  // getCopy() {
  //   console.log("in getcopy method")
  //   const copy = new Table({ name: this.name, rowsAmount: this.rowsAmount, columnsAmount: this.columnsAmount });
  //   console.log("first step of copying is completed")
  //   for (let i = 0; i < this.columnsAmount; ++i) {
  //     copy.headers[i] = this.headers[i];
  //   }

  //   console.log("headers have been copied")
  //   for(let i = 0; i < this.rowsAmount; ++i) {
  //     for (let j = 0; j < this.columnsAmount; ++j) {
  //       console.log(`i=${i}; j=${j}`)
  //       copy.table_data[i][j] = this.table_data[i][j];
  //     }
  //   }
  //   console.log("возвращаем копию успешно")
  //   return copy;
  // }

  setName(newName: string) {
    this.name = newName;
  }

  setRowsAmount(rowsAmount: number) {
    this.rowsAmount = rowsAmount;
  }

  setColumnsAmount(columnsAmount: number) {
    this.columnsAmount = columnsAmount;
  }

  /**
   * Устанавливает заголовок value по индексу index
   *
   * @param {number} index - индекс заголовка который надо задать
   * @param {string} value - новое значение
   */
  setHeader(index: number, value: string) {

    if (index < 0 || index >= this.columnsAmount) {
      throw new Error(`invalid index for header\nindex=${index}`);
    }
    this.headers[index] = value;
  }

  /**
    * Устанавливает значение value в ячейку с координатами row, column 
    * @param {{ row: number, column: number, value: string }} props - координаты строки, столбца, значение
    */
  setValue(props: { row: number, column: number, value: string, }) {
    const { row, column, value, } = props;

    if (row < 0 || column < 0 || row >= this.rowsAmount || column >= this.columnsAmount) {
      throw new Error(`невалидные индексы: row: ${row}, col: ${column}`);
    }

    this.table_data[row][column] = value;
  }
}