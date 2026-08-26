// 10. React Router v6 기반 App 라우터 설정
// src/app/routes/AppRouter.tsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
