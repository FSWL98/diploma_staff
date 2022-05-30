import React, { useState, useEffect, useRef, useCallback } from 'react';
import {InputText} from "primereact/inputtext";
import _ from 'lodash';
import {SolutionsService} from "../../services/solutionsService";
import {Toast} from "primereact/toast";

const MarkItem = ({ criteria, mark, solutionId, onChange }) => {
  const [score, setScore] = useState(0);
  const ref = useRef(null);
  const handleDebounce = (value, mark, solution_id, criteria_id) => {
    if (mark.mark_id) {
      SolutionsService.saveMark({
        ...mark,
        score: parseInt(value, 10)
      })
        .then((res) => {
          if (res.error) {
            ref.current.show({ severity: 'error', summary:'Ошибка', detail: `${res.error}: ${res.message}`, life: 3000 });
          }
          else {
            ref.current.show({ severity: 'success', summary: 'Отлично!', detail: 'Оценка сохранена', life: 3000 });
            onChange(criteria_id, res);
          }
        })
    } else {
      SolutionsService.createMark({
        solution_id,
        criteria_id,
        score: parseInt(value, 10)
      })
        .then((res) => {
          if (res.error) {
            ref.current.show({ severity: 'error', summary:'Ошибка', detail: `${res.error}: ${res.message}`, life: 3000 });
          }
          else {
            ref.current.show({ severity: 'success', summary: 'Отлично!', detail: 'Оценка сохранена', life: 3000 });
            onChange(criteria_id, res);
          }
        })
    }
  }
  const debounceFunc = useCallback(_.debounce(handleDebounce, 500), [])

  useEffect(() => {
    setScore(mark?.score || null);
  }, [mark]);

  const handleChange = e => {
    setScore(e.target.value);
    debounceFunc(e.target.value, mark, solutionId, criteria.criteria_id);
  };

  return (
    <div className='flex flex-column align-items-stretch flex-grow-1 mx-3'>
      <Toast ref={ref} position='top-right' />
      <span className='text-left block mb-2' title={criteria.description}>{criteria.name}</span>
      <span className='text-xs text-left font-light block mb-2'>
            ({criteria.minimum} - {criteria.maximum})
          </span>
      <InputText
        type='number'
        value={score}
        max={criteria.maximum}
        min={criteria.minimum}
        onChange={handleChange}
      />
    </div>
  );
}

export default MarkItem;