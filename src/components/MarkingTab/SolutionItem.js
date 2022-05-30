import React, { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import MarkItem from "./MarkItem";

const SolutionItem = ({ solution, criterias, fetch }) => {
  const [marks, setMarks] = useState({});

  useEffect(() => {
    const user = AuthService.getUser();
    const marksArray = solution.marks.reduce((acc, el) => {
      if (el.staff_id !== user.id)
        return acc;
      acc[el.criteria_id] = el;
      return acc;
    }, {})
    setMarks(marksArray);
  }, [])

  const changeMark = (criteria_id, newMark) => {
    const newObj = marks;
    newObj[criteria_id] = newMark;
    setMarks(newObj);
    fetch();
  }

  return (
    <div className='flex justify-content-between px-3'>
      {criterias.map((el) => {
        return <MarkItem
          criteria={el}
          mark={marks[el.criteria_id]}
          solutionId={solution.solution_id}
          onChange={changeMark}
          key={el.criteria_id}
        />
      })}
    </div>
  )
}

export default SolutionItem;
