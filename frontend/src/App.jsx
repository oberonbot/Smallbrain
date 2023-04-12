import React from 'react';
import { hot } from 'react-hot-loader/root';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DashBoard from './routes/DashBoard';
import Login from './routes/Login';

const router = createBrowserRouter([
  { path: '/', element: <DashBoard /> },
  { path: '/login', element: <Login /> },
]);

function App () {
  const output = (
    <div className="app">
      <main>
        <RouterProvider router={router} />
      </main>
    </div>
  );

  return output;
}
export default hot(App);
