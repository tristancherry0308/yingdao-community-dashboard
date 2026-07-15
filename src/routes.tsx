import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: '数据看板',
    path: '/',
    element: <DashboardPage />,
    public: true,
  },
  {
    name: '数据管理',
    path: '/admin',
    element: <AdminPage />,
    public: true,
  },
];
