import React, { useEffect, useState, useContext } from 'react';
import {
  Alert,
  Button,
  Divider,
  Grid,
  Input,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import MyAppBar from '../Components/MyAppBar'
import styled from 'styled-components';
import CheckIcon from '@mui/icons-material/Check';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import api from '../utils';

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

const Thumbnail = styled.label`
    display: block;
    height: 240px;
    width: 300px;
    border: solid black 1px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center;
    cursor: pointer;

    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
    background-color: rgb(245,245,245);
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
    }
`;

const StyledImg = styled.img`
    object-fit: cover;
    height: 100%;
    width: 100%;
    border-radius: 5px;
`;

const GameInfo = () => {
  const [isSaveClicked, setIsSaveClicked] = useState(true);
  const [buttonVariant, setButtonVariant] = useState('contained');
  const [snackbar, setSnackBar] = useState(false);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(
    {
      name: '',
      // description: '',
      thumbnail: null,
      questions: [
      ]
    }
  );

  const location = useLocation();
  const quizId = location.pathname.split('/')[3];

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null) {
      navigate('/login');
    }

    const fetchData = async () => {
      const result = await api(`admin/quiz/${quizId}`, 'GET', undefined, currentUser);
      // console.log(result);
      if (result.status === 200) {
        setQuiz(result.data);
      } else {
        setError(result.data.error);
      }
    };
    fetchData();
  }, []);

  // ADD QUESTION
  async function handleAddQst () {
    const oldQsts = quiz.questions;
    const newQst =
      {
        type: 'single',
        time: 5,
        points: 3,
        title: 'Untitled',
        img: '',
        link: '',
        answers: [
          { content: 'untitled', isAnswer: true },
          { content: 'untitled', isAnswer: false },
          { content: 'untitled', isAnswer: false },
          { content: 'untitled', isAnswer: false }]
      }

    oldQsts.push(newQst);
    setQuiz({ ...quiz, questions: oldQsts });
    const result = await api(`admin/quiz/${quizId}`, 'PUT', quiz, currentUser);
    // console.log(result);
    if (result.status === 200) {
      const newQstIndex = quiz.questions.length - 1;
      navigate(`/admin/quiz/${quizId}/${newQstIndex}`);
    } else {
      setError(result.data.error);
    }
  }

  function setSaveButtonStatus (isAvailable) {
    if (isAvailable) {
      setButtonVariant('outlined');
      setIsSaveClicked(false);
    } else {
      setButtonVariant('contained');
      setIsSaveClicked(true);
    }
  }

  function handleFileChng (e) {
    setSaveButtonStatus(true);
    const selectedFile = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = function () {
      // setPreviewSrc(reader.result);
      setQuiz({ ...quiz, thumbnail: reader.result });
      console.log(reader.result);
    };
  }

  function handleQuizTitleChng (e) {
    setSaveButtonStatus(true);
    setQuiz({ ...quiz, name: e.target.value });
  }

  function handleQuizDescChng (e) {
    setSaveButtonStatus(true);
    setQuiz({ ...quiz, description: e.target.value });
  }

  async function handleUpdateQst () {
    setSaveButtonStatus(false);
    // console.log(quiz);
    const result = await api(`admin/quiz/${quizId}`, 'PUT', quiz, currentUser);
    // console.log(result);
    if (result.status === 200) {
      navigate(`/admin/quiz/${quizId}`);
    } else {
      setError(result.data.error);
    }
  }

  // DELETE QUIZ
  async function handleDelQst () {
    const result = await api(`admin/quiz/${quizId}`, 'DELETE', quiz, currentUser);
    if (result.status === 200) {
      navigate('/');
    } else {
      setError(result.data.error);
    }
  }

  return (
    <Stack sx={{ height: '98vh' }}>
    <MyAppBar></MyAppBar>
    <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
        open={snackbar}
        onClose={() => { setSnackBar(false) }}
      >
        <Alert severity="error" sx={{ width: '100%' }} variant='filled'>
          {error}
        </Alert>
      </Snackbar>
    <Grid container spacing={0} sx={{ flexGrow: 1 }}>

      {/* Left Panel */}
      <Grid item md={2} mt={10} sx={{ px: 6 }}>
        <Stack spacing={2}>
          <Button variant="contained" color='info' href={`/admin/quiz/${quizId}`}>summary</Button>
          <Divider></Divider>
          {quiz.questions.map((question, index) => (
            <Button variant="outlined" key={index} href={`/admin/quiz/${quizId}/${index}`}>Q-{index + 1}</Button>
          ))}
          <Divider></Divider>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddQst}
          >
            Add Question
          </Button>

          <Button type="submit" variant="contained" color="primary" href='/'>
            Back to main
          </Button>

        </Stack>
      </Grid>

      {/* Right Panel */}
      <Grid item md={10} mt={3} mb={2}
        sx={{
          borderLeft: '1px solid black',
          px: 2,
        }}>
        <Stack spacing={1}>
          <Typography variant="h4" align="center">
            Summary
          </Typography>

          <Stack spacing={3} px={45} justifyContent="center" alignItems="center">
            {/* Photo, Title, Description */}
            <Input type="file" id="img" onChange={handleFileChng} sx={{ display: 'none' }}/>
            {quiz.thumbnail
              ? (
                <Thumbnail htmlFor="img">
                    <StyledImg src={quiz.thumbnail} alt="Preview" htmlFor="img"/>
                </Thumbnail>
                )
              : (
                <Thumbnail htmlFor="img">
                    <p>Upload photo</p>
                </Thumbnail>
                )}

            {/* Title */}
            <StyledInput
                label={'Quiz Title'}
                variant="outlined"
                fullWidth
                value={quiz.name}
                onChange={(e) => handleQuizTitleChng(e)}
            />

            <StyledInput
                label={'Description'}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                onChange={(e) => handleQuizDescChng(e)}
                disabled
            />

            {/* Bottom Buttons */}
            <Stack direction="row" spacing={2}>
                <Button variant={buttonVariant} startIcon={<CheckIcon />} onClick={() => handleUpdateQst()} color="success" disabled={isSaveClicked}>
                    {isSaveClicked ? 'SAVED' : 'SAVE'}
                </Button>

                <Button variant="outlined" color="error" startIcon={<Delete />}onClick={() => handleDelQst()}>
                    Delete this quiz
                </Button>
            </Stack>
          </Stack>

        </Stack>
      </Grid>

    </Grid>
  </Stack>
  )
}

export default GameInfo;
