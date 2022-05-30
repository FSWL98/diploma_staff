import React, { useState, useEffect } from 'react';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import './style.css';

const CriteriaTable = ({ criterias, marks }) => {
  const [tableValue, setTableValue] = useState({
    rows: [],
    columns: []
  });

  useEffect(() => {
    const columns = criterias.map((el) => {
      return {
        field: `${el.criteria_id}`,
        header: `${el.name} (Макс: ${el.maximum})`
      }
    });

    const staffMark = {};

    marks.forEach((el) => {
      if (staffMark[el.solution_id])
        staffMark[el.solution_id][el.criteria_id] = el.score;
      else {
        staffMark[el.solution_id] = {
          [el.criteria_id]: el.score
        };
      }
    });

    const rows = Object.keys(staffMark).map((el) => {
      const marksObj = {};
      let sum = 0;
      criterias.forEach((elem) => {
        marksObj[elem.criteria_id] = staffMark[el][elem.criteria_id] || '-';
        sum += typeof marksObj[elem.criteria_id] === 'number' ? marksObj[elem.criteria_id] : 0;
      })
      return {
        ...marksObj,
        id: el,
        name: el,
        sum
      }
    });

    setTableValue({
      rows,
      columns: [{
        field: 'name',
        header: 'ID Решения'
      }, ...columns, {
        field: 'sum',
        header: 'Итого'
      }]
    })
  }, [marks])

  const renderColumns = () => {
    return tableValue.columns.map((el) => {
      return <Column key={el.field} field={el.field} header={el.header} />
    })
  }

  return <DataTable value={tableValue.rows} emptyMessage='Еще нет оценок'>
    {renderColumns()}
  </DataTable>;
}

export default CriteriaTable;