import React from 'react';
import { hot } from 'react-hot-loader/root';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DashBoard from './routes/DashBoard';
import Login from './routes/Login';

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@emotion/react';
import Register from './routes/Register';
import Test from './routes/Test';
import Question from './routes/Question';
import GameInfo from './routes/GameInfo';
import Game from './routes/Game';
import JoinGame from './routes/JoinGame';
import Result from './routes/Result';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
});

const router = createBrowserRouter([
  { path: '/', element: <DashBoard /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/admin/quiz/:quizid/:questionid', element: <Question /> },
  { path: '/admin/quiz/:quizid', element: <GameInfo/> },
  { path: '/session/:sessionId/player/:playerId', element: <Game/> },
  { path: '/session/:sessionId/join', element: <JoinGame/> },
  { path: '/admin/session/:sessionId/results', element: <Result/> },
  { path: '/test', element: <Test></Test> }
]);

function App () {
  const output = (
    <ThemeProvider theme={theme}>
      <main>
        <RouterProvider router={router} />
      </main>
    </ThemeProvider>
  );

  return output;
}
export default hot(App);
