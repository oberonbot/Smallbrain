import React, { useEffect, useState, useContext } from 'react'
import api from '../utils';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import { Alert, Button, Container, Grid, Snackbar, Stack, Typography } from '@mui/material';

const Result = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [snackbar, setSnackBar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const [board, setBoard] = useState([
    {
      name: 'untitled',
      score: 0,
    },
    {
      name: 'untitled',
      score: 0,
    },
    {
      name: 'untitled',
      score: 0,
    },
    {
      name: 'untitled',
      score: 0,
    },
  ]);

  useEffect(() => {
    if (currentUser === null) {
      navigate('/login');
    }

    const sessionId = location.pathname.split('/')[3];

    // console.log(sessionId);
    const fetchData = async () => {
      const result2 = await api(`admin/session/${sessionId}/status`, 'GET', undefined, currentUser);
      if (result2.status === 200) {
        console.log('ok');
      } else {
        handleMessage('error', result2.data.error);
      }

      const result = await api(`admin/session/${sessionId}/results`, 'GET', undefined, currentUser);
      if (result.status === 200) {
        // setResults(result.data);
      } else {
        handleMessage('error', result.data.error);
      }

      const gameStatus = result2.data.results;
      const gameResults = result.data.results;

      console.log(gameResults);
      const tempBoard = [];
      for (let i = 0; i < gameResults.length; i++) {
        const tempPlayer = gameResults[i];
        const tempName = tempPlayer.name;
        let tempScore = 0;
        for (let j = 0; j < tempPlayer.answers.length; j++) {
          const answer = tempPlayer.answers[j];
          if (answer.correct) {
            tempScore = tempScore + gameStatus.questions[j].points;
          }
        }
        tempBoard.push({
          name: tempName,
          score: tempScore,
        })
      }
      setBoard(tempBoard)
    };
    fetchData();
  }, []);

  function handleMessage (severity, message) {
    setMessage(message);
    setSeverity(severity)
    setSnackBar(true);
  }

  return (
    <Container>
        <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
        open={snackbar}
        onClose={() => { setSnackBar(false) }}
      >
        <Alert severity={severity} sx={{ width: '100%' }} variant='filled'>
          {message}
        </Alert>
      </Snackbar>
      <Stack direction={'column'} spacing={2} p={40}>
        <Grid container >
          <Grid item md={4}>
            <Typography>Rank</Typography>
          </Grid>
          <Grid item md={4}>
            <Typography>Name</Typography>
          </Grid>
          <Grid item md={4}>
            <Typography>Score</Typography>
          </Grid>
        {board.map((data, index) => (
          <React.Fragment key={index}>
          <Grid item md={4} key={`rank-${index}`}>
            <Typography>{index}</Typography>
          </Grid>
          <Grid item md={4} key={`name-${index}`}>
            <Typography>{data.name}</Typography>
          </Grid>
          <Grid item md={4} key={`score-${index}`}>
            <Typography>{data.score}</Typography>
          </Grid>
        </React.Fragment>
        ))}
        </Grid>
      <Button href='/' variant='outlined'>BACK TO MAIN</Button>
      </Stack>

    </Container>
  )
}

export default Result
