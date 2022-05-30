import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import {EventsService} from "../../services/eventService";
import Header from "../../components/Header";
import EventTab from "../../components/EventTab/EventTab";

const EventPage = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState({});

  useEffect(() => {
    EventsService.getEventById(params.id)
      .then((res) => {
        if (res.error) {
          setEvent(null)
        }
        else setEvent(res)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Loader />
  }

  if (!event) {
    return <span>Not found</span>
  }

  return <>
    <Header />
    <EventTab event={event} />
  </>
}

export default EventPage;