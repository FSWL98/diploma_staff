import React from 'react';
import { Button } from 'primereact/button';
import {Tag} from "primereact/tag";
import { useNavigate } from 'react-router-dom';

const EventsList = ({ events }) => {
  const navigate = useNavigate();
  const parseDate = date => {
    const dateString = date.split('T')[0];
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  }
  const getDate = el => {
    const start = parseDate(el.date_start);
    const end = parseDate(el.date_end);
    return `${start} - ${end}`;
  }

  const renderTag = el => {
    const now = new Date().getTime();
    const start = new Date(el.date_start).getTime();
    const end = new Date(el.date_end).getTime();
    if (now > end)
      return <Tag value='Завершен' severity='info' className='text-xs ml-2' rounded />
    if (start > now)
      return <Tag value='Ожидает начала' severity='warning' className='text-xs ml-2' rounded />
    return <Tag value='Идет' severity='success' className='text-xs ml-2' rounded />;
  }

  const handleEventClick = el => {
    navigate(`/events/${el.event_id}`);
  }

  return(
    <div className='flex flex-column align-items-stretch p-5'>
      {events.map((el) => {
        const date = getDate(el);
        return (
          <div
            className='flex justify-content-between p-3 border-primary border-solid my-1 align-items-center'
            key={el.event_id}
          >
            <span className='text font-bold w-4 text-left'>
              {el.name}
              {renderTag(el)}
            </span>
            <div className='flex flex-column align-items-center'>
              <span className='text font-light text-sm'>Даты проведения:</span>
              <span className='text font-light text-sm'>{date}</span>
            </div>
            <div className='w-3 text-right'>
              <Button
                label='Перейти к оценкам'
                disabled={
                  (el.evaluation_method === 'simple' && new Date(el.date_start) > new Date()) ||
                  (el.evaluation_method === 'complex' && new Date(el.date_end) > new Date())
                }
                onClick={() => handleEventClick(el)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
};

export default EventsList;