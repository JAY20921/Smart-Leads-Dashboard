import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div className="text-center">
      <p className="text-8xl font-black text-brand-600 dark:text-brand-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 btn-md btn-primary"
      >
        <Home size={16} />
        Back to Dashboard
      </Link>
    </div>
  </div>
);
