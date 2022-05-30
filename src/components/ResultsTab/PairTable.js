import React, { useState, useEffect } from 'react';
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

const PairTable = ({ marks, solutions }) => {
  const [tableValue, setTableValue] = useState({
    rows: [],
    columns: []
  });

  useEffect(() => {
    const columns = solutions.map((el) => {
      return {
        field: `${el}`,
        header: `Решение №${el}`
      }
    });

    const rowsDict = solutions.reduce((acc, el) => {
      acc[el] = {
        [el]: 1,
        sum: 0
      }
      return acc
    }, {})

    marks.forEach((el) => {
      rowsDict[el.first_solution_id][el.second_solution_id] = el.score;
      rowsDict[el.second_solution_id][el.first_solution_id] = 2 - el.score;
      rowsDict[el.first_solution_id].sum += el.score;
      rowsDict[el.second_solution_id].sum += 2 - el.score;
    })

    const rows = Object.keys(rowsDict).map((el) => {
      return {
        id: `Решение №${el}`,
        ...rowsDict[el],
        sum: rowsDict[el].sum / 2
      }
    })

    setTableValue({
      rows,
      columns: [{
        field: 'id',
        header: 'Номер решения'
      }, ...columns, {
        field: 'sum',
        header: 'Итого'
      }]
    })
  }, [marks]);

  const renderColumns = () => {
    return tableValue.columns.map((el) => {
      return <Column key={el.field} field={el.field} header={el.header} />
    })
  }

  return <DataTable value={tableValue.rows} emptyMessage='Еще нет оценок'>
    {renderColumns()}
  </DataTable>;
};

export default PairTable;