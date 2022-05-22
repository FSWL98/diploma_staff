import React from 'react';
import './style.css';
import { NavLink } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { AuthService } from '../../services/authService';
import { Button } from 'primereact/button';

const Header = () => {
  const user = AuthService.getUser();

  const getAvatarLabel = () => {
    return `${user?.person?.name[0] || 'N'}${user?.person?.surname[0] || 'N'}`;
  }

  const handleLogout = () => {
    AuthService.logout();
    window.location.reload();
  }
  return (
    <header className='flex justify-content-between p-3 align-items-center'>
      <div className='menu'>
        <NavLink
          to='/events'
          className={({ isActive }) => `text-white font-bold font-xl no-underline uppercase ${isActive ? '' : 'opacity-70'} menu__link mx-3`}
        >
          Мероприятия
        </NavLink>
        {/*<NavLink*/}
        {/*  to='/solutions'*/}
        {/*  className="text-white font-bold font-xl no-underline uppercase opacity-70 menu__link"*/}
        {/*>*/}
        {/*  Мои решения*/}
        {/*</NavLink>*/}
      </div>
      <div className='account flex align-items-center'>
        <Avatar label={getAvatarLabel()} size='medium' shape='circle' />
        <span className='text block mx-2 text-white'>{user?.person?.name} {user?.person?.surname}</span>
        <Button icon="pi pi-sign-out" className="p-button-rounded p-button-text text-white" onClick={handleLogout}/>
      </div>
    </header>
  )
};

export default Header;