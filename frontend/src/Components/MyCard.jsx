import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Alert, Box, Button, CardActions, Grid, Modal, Snackbar, Stack } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import api from '../utils';
import { AuthContext } from '../authContext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const StyledCard = styled(Card)`
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
`;

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  background-color: white;
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 24px;
  padding: 16px;
`;

export default function MyCard ({ card }) {
  // console.log(card);
  const [snackbar, setSnackBar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [isGameStart, setIsGameStart] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [sessionId, setSessionId] = useState('');
  const [modal, setModal] = useState(false);
  const [totalTime, setTotalTime] = useState('');
  const port = '3000';
  const [qstCount, setQstCount] = useState(0);
  const [isQstsOver, setIsQstOver] = useState(false);

  const [quiz, setQuiz] = useState(
    {
      name: '',
      // description: '',
      thumbnail: null,
      createdAt: '',
      questions: [
      ]
    })

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null) {
      navigate('/login');
    }

    const fetchData = async () => {
      const result = await api(`admin/quiz/${card.id}`, 'GET', undefined, currentUser);
      // console.log(result);
      if (result.status === 200) {
        setQuiz(result.data);
        let tempTime = 0;
        for (const question of result.data.questions) {
          tempTime = tempTime + question.time;
        }
        setTotalTime(tempTime);
      } else {
        handleMessage('error', result.data.error);
      }
    };
    fetchData();
  }, []);

  async function handleStartGame (quizId) {
    if (sessionId !== '') {
      setModal(true);
    } else {
      const result = await api(`admin/quiz/${quizId}/start`, 'POST', undefined, currentUser);
      if (result.status === 200) {
        const result2 = await api(`admin/quiz/${quizId}`, 'GET', undefined, currentUser);
        setSessionId(result2.data.active);
        setIsGameStart(true);
        setModal(true);
      } else {
        handleMessage('error', result.data.error);
      }
    }
  }

  function handleEditGame (quizId) {
    navigate(`/admin/quiz/${quizId}`);
  }

  function handleCopyClicked () {
    navigator.clipboard.writeText(`localhost:${port}/session/${sessionId}/join`);
    handleMessage('info', 'SessionId copied to clipboard!')
  }
  function handleMessage (severity, message) {
    setMessage(message);
    setSeverity(severity)
    setSnackBar(true);
  }

  async function handleEndGame (quizId) {
    const result = await api(`admin/quiz/${quizId}/end`, 'POST', undefined, currentUser);
    if (result.status === 200) {
      setIsGameStart(false);
      setQstCount(0);
      handleMessage('info', 'Game session ends successfully')
    } else {
      handleMessage('error', result.data.error)
    }
  }

  async function handleSendQst (quizid) {
    const result = await api(`admin/quiz/${quizid}/advance`, 'POST', { quizid }, currentUser);
    if (result.status === 200) {
      // console.log(qstCount);
      if (qstCount === quiz.questions.length - 1) {
        setIsQstOver(true);
        handleMessage('info', 'Last question is sent!');
      } else {
        setQstCount(qstCount + 1);
      }
      handleMessage('info', 'Question is sent successfully');
    } else {
      handleMessage('error', result.data.error)
    }
  }

  function handleResult () {
    navigate(`/admin/session/${sessionId}/results`);
  }

  return (
    <>
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
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <Stack spacing={1} alignItems={'center'}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Copy the session and send it to your friends!
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={8}>
                <Typography variant="h4" align="center">
                  {sessionId}
                </Typography>
              </Grid>
              <Grid item md={4}>
                <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={() => handleCopyClicked()} color="success" sx={{ height: '100%' }}>
                  Copy
                </Button>
              </Grid>
            </Grid>

          </Stack>

        </StyledBox>
      </Modal>
      <StyledCard sx={{ maxWidth: 345 }}>
    {
      card.thumbnail
        ? (
        <CardMedia
          component="img"
          height="160"
          image={card.thumbnail}
          alt="intro img"
        />
          )
        : (
        <Box sx={{ height: 160, bgcolor: 'gray' }} />
          )
    }

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {card.name}
          </Typography>
          <Stack direction={'row'} spacing={5}>
            <Typography variant="body2" color="text.secondary">
              Questions: {quiz.questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Time(s): {totalTime}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
              Created At: {quiz.createdAt.slice(0, 10)}
            </Typography>

        </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={1}>
          <Grid item md={3}>
            <Button variant={ isGameStart ? 'contained' : 'outlined'} color="info" size="small" onClick={() => { handleStartGame(card.id) }}>{isGameStart ? 'Active' : 'Start'}</Button>
          </Grid>
          <Grid item md={3}>
            <Button variant="outlined" size="small" disabled={isGameStart} onClick={() => { handleEditGame(card.id) }}>Edit</Button>
          </Grid>
          <Grid item md={3}>
            <Button variant="outlined" color="error" size="small" fullWidth disabled={isGameStart} onClick={() => { handleEditGame(card.id) }}>Delete</Button>
          </Grid>
          <Grid item md={3}>
            <Button variant={ isGameStart ? 'outlined' : 'contained'} color="primary" size="small" onClick={() => { handleEndGame(card.id) }}>{isGameStart ? 'END' : 'ENDED'}</Button>
          </Grid>

              <Grid item md={6}>
            <Button variant="outlined" disabled={isQstsOver} fullWidth color="success" size="small" onClick={() => { handleSendQst(card.id) }}>{isQstsOver ? 'Finished' : `Next: Question ${qstCount + 1}`}</Button>
          </Grid>
          <Grid item md={6}>
            <Button variant="outlined" fullWidth size="small" onClick={handleResult}>Result</Button>
          </Grid>

        </Grid>

      </CardActions>
    </StyledCard>
    </>

  );
}
