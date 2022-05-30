import React, { useEffect, useState, useRef } from 'react';
import { EventsService } from '../../services/eventService';
import Loader from '../../components/Loader';
import { Toast } from 'primereact/toast';
import Header from '../../components/Header';
import EventsList from '../../components/EventsList';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useRef(null);

  const sortByDate = (a, b, date_field = 'date_start') => {
    const dateA = new Date(a[date_field]);
    const dateB = new Date(b[date_field]);
    if (dateA > dateB)
      return 1;
    return -1;
  };

  useEffect(() => {
    setLoading(true);
    EventsService.getEvents()
      .then((res) => {
        if (res.error)
          toast.current.show({
            severity: 'danger',
            summary: 'Ошибка!',
            detail: 'Прозошла ошибка при загрузке данных. Перезагрузите страницу',
            life: 3000
          })
        else {
          const eventsDict = res.events.reduce((acc, el) => {
            const now = new Date().getTime();
            const start = new Date(el.date_start).getTime();
            const end = new Date(el.date_end).getTime();

            if (start <= now && end > now) {
              acc.current = [...acc.current, el];
            } else if (start > now) {
              acc.future = [...acc.future, el];
            } else {
              acc.ended = [...acc.ended, el];
            }
            return acc;
          }, {
            current: [],
            future: [],
            ended: []
          })
          let eventsList = [
            ...eventsDict.current.sort((a, b) => sortByDate(a, b, 'date_end')),
            ...eventsDict.future.sort(sortByDate),
            ...eventsDict.ended.sort(sortByDate)
          ];
          setEvents(eventsList);
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {

    return <Loader />;
  }

  return (
    <>
      <Toast ref={toast} position='top-right' />
      <Header />
      <EventsList events={events} />
    </>
  );

}

export default EventsPage;