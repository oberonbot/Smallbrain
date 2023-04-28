import { Alert, Box, Button, Container, Snackbar, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components';
import Typewritter from '../Components/Typewritter';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils';

const StyledBox = styled(Box)`
  background-color: black;
  color: white;
  padding: 10px;
  min-width: 10px;
  max-width: 365px;
  height: 40px;
`;

const StyledInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'black',
    },
  },
})

const JoinGame = () => {
  const [playerName, setPlayerName] = useState('');
  const [snackbar, setSnackBar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const location = useLocation();
  const sessionId = location.pathname.split('/')[2];
  const navigate = useNavigate();

  function handleMessage (severity, message) {
    setMessage(message);
    setSeverity(severity)
    setSnackBar(true);
  }

  async function handleJoinGame () {
    const sessionId = location.pathname.split('/')[2];
    const result = await api(`play/join/${sessionId}`, 'POST', { name: playerName }, undefined);
    console.log(result);
    if (result.status === 200) {
      const sessionId = location.pathname.split('/')[2];
      const playerId = result.data.playerId;
      navigate(`/session/${sessionId}/player/${playerId}`);
    } else {
      handleMessage('error', result.data.error)
    }
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
    <Stack pt={10} alignItems="center">
      <StyledBox>
        <Typography variant="h4" component="h2">
          <Typewritter text="Welcome to GameStop!" />
        </Typography>
      </StyledBox>
      <Typography variant="h4" component="h2" pt={5}>
            {'Enter your name to join the game! :)'}
      </Typography>
      <Stack sx={{ width: '300px' }} spacing={3} pt={5} alignItems="center">
        <StyledInput
          label="PIN"
          variant="outlined"
          fullWidth
          value={sessionId}
          disabled
        />
        <StyledInput
          label="Player Name"
          variant="outlined"
          fullWidth
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleJoinGame}
          fullWidth
          sx={{ height: '50px' }}
        >
          Join the game
        </Button>
        <br />

      </Stack>
    </Stack>
  </Container>
  )
}

export default JoinGame
