import { createBrowserRouter, Navigate } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import Login from './views/Login';
import Signup from './views/Signup';
import AdminDashboard from './views/admin/Dashboard';
import Users from './views/admin/Users';
import Stores from './views/admin/Stores';
import Catalog from './views/user/Catalog';
import OwnerDashboard from './views/owner/Dashboard';
import Profile from './views/Profile';
import NotFound from './views/NotFound';
import Forbidden from './views/Forbidden';

function RequireRole({ role, children }: { role: 'ADMIN' | 'USER' | 'OWNER'; children: React.ReactNode }) {
  const current = useSelector((s: RootState) => s.auth.role);
  if (!current) return <Navigate to="/login" replace />;
  if (current !== role) return <Forbidden />;
  return <>{children}</>;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const current = useSelector((s: RootState) => s.auth.role);
  if (!current) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/admin', element: <RequireRole role="ADMIN"><AdminDashboard /></RequireRole> },
  { path: '/admin/users', element: <RequireRole role="ADMIN"><Users /></RequireRole> },
  { path: '/admin/stores', element: <RequireRole role="ADMIN"><Stores /></RequireRole> },
  { path: '/catalog', element: <RequireRole role="USER"><Catalog /></RequireRole> },
  { path: '/owner', element: <RequireRole role="OWNER"><OwnerDashboard /></RequireRole> },
  { path: '/profile', element: <RequireAuth><Profile /></RequireAuth> },
  { path: '/403', element: <Forbidden /> },
  { path: '*', element: <NotFound /> },
]);

