import React from 'react';
import { Outlet } from 'react-router-dom';
import useTitle from '../feature/useTitle';
import Header from './Header';

const Layout = () => {
  useTitle("rtk-lesson5-Users&Posts");
  return (
    <>
    
      <Header />
      <main className="app">
        <Outlet />
      </main>
    </>
  );
}

export default Layout
