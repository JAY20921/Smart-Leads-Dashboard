import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => (
  <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
    <Sidebar />
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Outlet />
    </main>
  </div>
);
