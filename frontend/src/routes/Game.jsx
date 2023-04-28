import { Alert, Button, Chip, Grid, Snackbar, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import api from '../utils';
// import { useNavigate } from 'react-router-dom';

const Thumbnail = styled.label`
  display: block;
  height: 250px;
  width: 400px;
  border: solid black 1px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center;
`;

const StyledImg = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-radius: 5px;
`;

const Game = () => {
  const [snackbar, setSnackBar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const [timeLeft, setTimeLeft] = useState(6000);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // const navigate = useNavigate();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const [isExpanded, setIsExpanded] = useState(false);
  const [qst, setQst] = useState({
    type: 'single',
    time: 10,
    points: 3,
    title: '',
    img: null,
    link: '',
    answers: [
      { content: '', isAnswer: false },
      { content: '', isAnswer: false },
      { content: '', isAnswer: false, },
      { content: '', isAnswer: false, }]
  })

  const [answerA, setAnswerA] = useState(true);
  const [answerB, setAnswerB] = useState(false);
  const [answerC, setAnswerC] = useState(false);
  const [answerD, setAnswerD] = useState(false);
  const [answerE, setAnswerE] = useState(false);
  const [answerF, setAnswerF] = useState(false);

  const [rightAnswers, setRightAnswers] = useState('');
  const [answerIds, setAnswerIds] = useState([0]);

  const [isActiveSession, setIsActiveSession] = useState(false);

  const fetchData = async () => {
    const playerId = location.pathname.split('/')[4];
    const result = await api(`play/${playerId}/question`, 'GET', undefined, undefined);
    // console.log(result);
    if (result.status === 200) {
      setQst(result.data.question);

      if (result.data.question.answers.length === 6) {
        setIsExpanded(true);
      }

      // start the countdown
      setTimeLeft(result.data.question.time);

      // This is for showing 'waiting' page,
      // if session is active, then question is displayed
      setIsActiveSession(true);
    } else {
      if (result.data.error === 'Session ID is not an active session') {
        setIsActiveSession(false);
      } else if (result.data.error === 'Session has not started yet') {
        setIsActiveSession(false);
      } else {
        handleMessage('error', result.data.error);
      }
    }
  };

  useEffect(() => {
    // fetch data only when qst.title is empty or timeLeft is zero
    if (qst.title === '') {
      fetchData();
    }

    let interval = null;
    interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    if (timeLeft === 0) {
      setButtonDisabled(true);
      getRightAnswers();
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  function handleMessage (severity, message) {
    setMessage(message);
    setSeverity(severity)
    setSnackBar(true);
  }

  async function handleAnsClicked (ansIndex, e) {
    const qstType = qst.type;
    console.log(answerIds);
    if (ansIndex === 0) {
      // select A && question type is single, so need to de-select other answers
      if (!answerA && qstType === 'single') {
        setAnswerB(false);
        setAnswerC(false);
        setAnswerD(false);
        setAnswerE(false);
        setAnswerF(false);
        setAnswerIds([0]);
      }
      // select A && question type is multi-select, nothing needs to be done
      if (!answerA && qstType === 'multi') {
        setAnswerIds(answerIds.push(0));
      }
      // de-select A && question type is sinle, then it's forbidden
      if (answerA && qstType === 'single') {
        // handleMessage('error', 'Single select question must have 1 answer');
        return;
      }
      setAnswerA(!answerA);
    } else if (ansIndex === 1) {
      if (!answerB && qstType === 'single') {
        console.log('good');
        setAnswerA(false);
        setAnswerC(false);
        setAnswerD(false);
        setAnswerE(false);
        setAnswerF(false);
        setAnswerIds([1]);
      }
      if (!answerB && qstType === 'multi') {
        answerIds.push(1);
      }
      if (answerB && qstType === 'single') {
        // handleMessage('error', 'Single select question must have 1 answer');
        return;
      }
      setAnswerB(!answerB);
    } else if (ansIndex === 2) {
      if (!answerC && qstType === 'single') {
        setAnswerA(false);
        setAnswerB(false);
        setAnswerD(false);
        setAnswerE(false);
        setAnswerF(false);
        setAnswerIds([0]);
      }
      if (!answerC && qstType === 'multi') {
        answerIds.push(2);
      }
      if (answerC && qstType === 'single') {
        // handleMessage('error', 'Single select question must have 1 answer');
        return;
      }
      setAnswerC(!answerC);
    } else if (ansIndex === 3) {
      if (!answerD && qstType === 'single') {
        setAnswerA(false);
        setAnswerB(false);
        setAnswerC(false);
        setAnswerE(false);
        setAnswerF(false);
        setAnswerIds([3]);
      }
      if (!answerD && qstType === 'multi') {
        answerIds.push(3);
      }
      if (answerD && qstType === 'single') {
        // handleMessage('error', 'Single select question must have 1 answer');
        return;
      }
      setAnswerD(!answerD);
    } else if (ansIndex === 4) {
      if (!answerE && qstType === 'single') {
        setAnswerA(false);
        setAnswerB(false);
        setAnswerC(false);
        setAnswerD(false);
        setAnswerF(false);
        setAnswerIds([4]);
      }
      if (!answerE && qstType === 'multi') {
        answerIds.push(4);
      }
      if (answerE && qstType === 'single') {
        // handleMessage('error', 'Single select question must have 1 answer');
        return;
      }
      setAnswerE(!answerE);
    } else {
      if (!answerA && qstType === 'single') {
        setAnswerA(false);
        setAnswerB(false);
        setAnswerC(false);
        setAnswerD(false);
        setAnswerE(false);
        setAnswerIds([5]);
      }
      if (!answerF && qstType === 'multi') {
        answerIds.push(5);
      }
      if (answerF && qstType === 'single') {
        // handleMessage('error', 'Single select question must have 1 answer');
        return;
      }
      setAnswerF(!answerF);
    }

    const playerid = location.pathname.split('/')[4];
    // console.log({ answerIds });
    const result = await api(`play/${playerid}/answer`, 'PUT', { answerIds }, undefined);
    // console.log(result);
    if (result.status === 200) {
      // console.log();
    } else {
      handleMessage('error', result.data.error);
    }
  }

  function handleRfrncClckd () {
    if (qst.link === '') {
      handleMessage('info', 'This question has no reference link needed')
    } else {
      window.open(qst.link, '_blank', 'noopener');
    }
  }

  async function getRightAnswers () {
    const numToOption = ['A', 'B', 'C', 'D', 'E', 'F'];
    let output = '';
    const playerid = location.pathname.split('/')[4];
    const result = await api(`play/${playerid}/answer`, 'GET', undefined, undefined);
    const answerIds = result.data.answerIds;
    for (const rightAnswerId of answerIds) {
      output = output + numToOption[rightAnswerId] + ', ';
    }
    setRightAnswers(output);
  }

  async function handleNextQst () {
    const playerId = location.pathname.split('/')[4];
    const result = await api(`play/${playerId}/question`, 'GET', undefined, undefined);
    if (result.status === 200) {
      if (result.data.question.title === qst.title) {
        handleMessage('info', "Host hasn't released the next question yet")
      } else {
        window.location.reload();
      }
    } else {
      handleMessage('error', result.data.error);
    }
  }

  return (
    <Stack sx={{ height: '98vh' }} alignItems={'center'}>
    {isActiveSession
      ? (
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

        <Stack spacing={2} px={20} pt={5} alignItems={'center'}>
          {qst.img
            ? (
              <Thumbnail htmlFor="img">
                  <StyledImg src={qst.img} alt="Preview" htmlFor="img"/>
              </Thumbnail>
              )
            : (
              <Thumbnail htmlFor="img">
                  <h3>Sry, no photo for this question</h3>
                  <h3>plz user your imagination</h3>
              </Thumbnail>
              )}

          {/* Question Title */}
          <Typography variant="h4" align="center">
          {qst.title}
          </Typography>

          {/* Question Info */}
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <Typography variant="h5" align="center">
                {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            </Typography>
            <Chip color="primary" label={`${qst.points} Points`} variant="outlined" />
            <Chip color="primary" label={qst.type === 'single' ? 'SINGLE SELECT' : 'MULTI-SELECT'} variant="outlined" />

            <Button size={'small'} variant="outlined" onClick={handleRfrncClckd}>Reference Link</Button>
            <Button size={'small'} variant="contained" color={'info'} disabled={!buttonDisabled} onClick={handleNextQst}>Next Question</Button>

          </Stack>

          {/* Answers */}
          <Grid container px={10}>
              <Grid item md={6} sx={{ px: 2 }} py={2}>
                <Stack direction={'row'} spacing={2}>
                  <Typography variant='h5'>A</Typography>
                  <Button disabled={buttonDisabled} fullWidth variant={ answerA ? 'contained' : 'outlined'} onClick={(e) => handleAnsClicked(0, e)}>{qst.answers[0].content}</Button>
                </Stack>
              </Grid>

              <Grid item md={6} sx={{ px: 2 }} py={2}>
              <Stack direction={'row'} spacing={2}>
                  <Typography variant='h5'>B</Typography>
                  <Button disabled={buttonDisabled} fullWidth variant={ answerB ? 'contained' : 'outlined'} onClick={(e) => handleAnsClicked(1, e)}>{qst.answers[1].content}</Button>
              </Stack>
              </Grid>

              <Grid item md={6} sx={{ px: 2 }} py={2}>
              <Stack direction={'row'} spacing={2}>
                  <Typography variant='h5'>C</Typography>
                  <Button disabled={buttonDisabled} fullWidth variant={ answerC ? 'contained' : 'outlined'} onClick={(e) => handleAnsClicked(2, e)}>{qst.answers[2].content}</Button>
              </Stack>
              </Grid>

              <Grid item md={6} sx={{ px: 2 }} py={2}>
              <Stack direction={'row'} spacing={2}>
                  <Typography variant='h5'>D</Typography>
                  <Button disabled={buttonDisabled} fullWidth variant={ answerD ? 'contained' : 'outlined'} onClick={(e) => handleAnsClicked(3, e)}>{qst.answers[3].content}</Button>
              </Stack>
              </Grid>

              {isExpanded && (
                  <>
                  <Grid item md={6} sx={{ px: 2 }} py={2}>
                  <Stack direction={'row'} spacing={2}>
                  <Typography variant='h5'>E</Typography>
                      <Button disabled={buttonDisabled} fullWidth variant={ answerE ? 'contained' : 'outlined'} onClick={(e) => handleAnsClicked(4, e)}>{qst.answers[4].content}</Button>
                  </Stack>
                  </Grid>

                  <Grid item md={6} sx={{ px: 2 }} py={2}>
                  <Stack direction={'row'} spacing={2}>
                  <Typography variant='h5'>F</Typography>
                      <Button disabled={buttonDisabled} fullWidth variant={ answerF ? 'contained' : 'outlined'} onClick={(e) => handleAnsClicked(5, e)}>{qst.answers[5].content}</Button>
                  </Stack>
                  </Grid>
                  </>
              )}
          </Grid>

          { buttonDisabled
            ? (
              <>
              <Typography variant='h6'>
            {`Right answer(s):  ${rightAnswers} please wait for host to continue`}
          </Typography>
              </>
              )

            : (<></>)}
        </Stack>
      </>
        )
      : (
          <>
          <Typography variant='h3' pt={25}>Please wait for host to send the question</Typography>
          </>
        )}

    </Stack>

  )
}

export default Game
