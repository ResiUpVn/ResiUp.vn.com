import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// FIX: The Layout component was updated to use <Outlet /> from react-router-dom v6.
// This is the correct way to render child routes within a layout route and resolves
// the error about the missing 'children' prop in App.tsx.
const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
