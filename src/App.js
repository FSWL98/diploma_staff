import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.min.css';
import PrivateRoute from "./components/PrivateRoute";
import EventPage from "./pages/EventPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route
            path='events'
            element={<Outlet />}
          >
            <Route
              index
              element={
                <PrivateRoute>
                  <EventsPage />
                </PrivateRoute>
              }
            />
            <Route path=':id' element={<PrivateRoute><EventPage /></PrivateRoute>} />
          </Route>
          <Route path='/' element={<Navigate to='/events' />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
