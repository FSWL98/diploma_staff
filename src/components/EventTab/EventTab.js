import React, { useState, useEffect } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { AuthService } from '../../services/authService';
import MarkingTab from '../MarkingTab';
import ResultsTab from '../ResultsTab';

const EventTab = ({ event }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const user = AuthService.getUser();
    if (user?.roles.find((el) => el.name === 'admin' || el.name === 'administrator'))
      setActive(1);
  }, [])

  const items = [
    { label: 'Оценивание', icon: 'pi pi-check-circle' },
    { label: 'Просмотр результатов', icon: 'pi pi-table' }
  ];

  const renderTab = () => {
    switch (active) {
      case 0:
        return <MarkingTab event={event} />
      case 1:
        return <ResultsTab event={event} />
    }
  }

  return (
    <div>
      <TabMenu activeIndex={active} model={items} onTabChange={(e) => setActive(e.index)} />
      {renderTab()}
    </div>
  )
};

export default EventTab;