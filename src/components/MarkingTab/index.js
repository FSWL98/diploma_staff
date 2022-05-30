import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/authService';
import CriteriaMarking from "./CriteriaMarking";
import PairMarking from "./PairMarking";

const MarkingTab = ({ event }) => {
  const [type, setType] = useState('');

  useEffect(() => {
    const user = AuthService.getUser();
    if (user?.roles.find((el) => el.name === 'admin' || el.name === 'administrator'))
      setType('forbidden')
    else if (event.evaluation_method === 'simple')
      setType('simple')
    else setType('pair')
  }, [])


  const renderMarking = () => {
    switch (type) {
      case 'forbidden':
        return <span className='text font-italic'>Вы не являетесь экспертом, оценивание запрещено</span>
      case 'simple':
        return <CriteriaMarking eventId={event.event_id} />
      case 'pair':
        return <PairMarking eventId={event.event_id} />
    }
  }


  return (
    <>
      {renderMarking()}
    </>
  );
}

export default MarkingTab;