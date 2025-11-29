import type Table from "../core/Table"

interface TableViewProps {
  currentTable: Table,
  setTableEmpty: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function TableView({ currentTable, setEmptyTable, }: TableViewProps) {
  return (
    <>
    </>
  )
}