import React, { useEffect, useState, useContext } from 'react';
import {

  Alert,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
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

const StyledSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'black',
    },
  },
});

const Thumbnail = styled.label`
  display: block;
  height: 188px;
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

function Question () {
  const [isAddAnsClicked, setIsAddAnsClicked] = useState(false);
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

  const [qst, setQst] = useState(
    {
      type: '',
      time: '',
      points: '',
      title: '',
      img: null,
      link: '',
      answers: [
        { content: '', isAnswer: false },
        { content: '', isAnswer: false },
        { content: '', isAnswer: false },
        { content: '', isAnswer: false }]
    }
  )

  const [isExpanded, setIsExpanded] = useState(false);

  const location = useLocation();
  const quizId = location.pathname.split('/')[3];
  const qstIndex = location.pathname.split('/')[4];

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null) {
      navigate('/login');
    }

    const fetchData = async () => {
      const result = await api(`admin/quiz/${quizId}`, 'GET', undefined, currentUser);
      console.log(result);
      if (result.status === 200) {
        setQuiz(result.data);
        setQst(result.data.questions[qstIndex]);
        if (result.data.questions[qstIndex].answers.length === 6) {
          setIsExpanded(true);
          setIsAddAnsClicked(true);
        }
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
      window.location.reload();
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
      setQst({ ...qst, img: reader.result });
      console.log(reader.result);
    };
  }

  function handleQstTitleChng (e) {
    setSaveButtonStatus(true);
    setQst({ ...qst, title: e.target.value });
  }

  function handleQstLinkChng (e) {
    setSaveButtonStatus(true);
    setQst({ ...qst, link: e.target.value });
  }

  function handleQstAnsChng (ansIndex, e) {
    setSaveButtonStatus(true);
    setQst(prevQst => {
      const updatedAnswers = [...prevQst.answers];
      updatedAnswers[ansIndex].content = e.target.value;
      return { ...prevQst, answers: updatedAnswers };
    })
  }

  function handleQstRghtAnsClicked (ansIndex, e) {
    const qstType = qst.type;
    let checkedBoxes = 0;
    for (const answer of qst.answers) {
      if (answer.isAnswer) {
        checkedBoxes++;
      }
    }

    /* If already selected type to single,
      && selected 1 answer,
      && the answer user is going to select is not the one that's already selected
    */
    if (qstType === 'single' && checkedBoxes === 1) {
      let checkedIndex;
      for (const answer of qst.answers) {
        if (answer.isAnswer) {
          checkedIndex = qst.answers.indexOf(answer);
          console.log(checkedIndex);
        }
      }
      if (ansIndex !== checkedIndex) {
        handleError('Please change question type to multi-select first')
        return;
      }
    }

    setSaveButtonStatus(true);
    setQst(prevQst => {
      const updatedAnswers = [...prevQst.answers];
      updatedAnswers[ansIndex].isAnswer = e.target.checked;
      return { ...prevQst, answers: updatedAnswers };
    })
  }

  // UPDATE QUESTION
  async function handleUpdateQst () {
    const qstType = qst.type;
    let checkedBoxes = 0;
    for (const answer of qst.answers) {
      if (answer.isAnswer) {
        checkedBoxes++;
      }
    }

    // single right answers, but set multi-select
    if (qstType === 'multi' && checkedBoxes === 1) {
      handleError('Please select more than 1 right answers, or change question type to single select')
      return;
    }

    // none of the right answers is selected
    if (qstType === 'multi' && checkedBoxes === 0) {
      handleError('Question type is multi-select, so please select at least 2 right answers')
      return;
    }
    if (qstType === 'single' && checkedBoxes === 0) {
      handleError('Question type is single select, so please select 1 right answer')
      return;
    }

    setSaveButtonStatus(false);
    const updateQuiz = quiz;
    // console.log(updateQuiz);
    updateQuiz.questions[qstIndex] = qst;
    setQuiz(updateQuiz);
    // console.log(quiz);
    const result = await api(`admin/quiz/${quizId}`, 'PUT', quiz, currentUser);
    // console.log(result);
    if (result.status === 200) {
      navigate(`/admin/quiz/${quizId}/${qstIndex}`);
    } else {
      setError(result.data.error);
    }
  }

  function handleAddAnsClicked () {
    setSaveButtonStatus(true);
    if (!isExpanded) {
      setQst(prevQst => {
        const updatedAnswers = [...prevQst.answers];
        updatedAnswers.push(
          { content: 'untitled', isAnswer: false }, { content: 'untitled', isAnswer: false }
        );
        return { ...prevQst, answers: updatedAnswers };
      })
      setIsAddAnsClicked(true);
      setIsExpanded(true);
    } else {
      setQst(prevQst => {
        const updatedAnswers = [...prevQst.answers];
        updatedAnswers.splice(4, 2)
        return { ...prevQst, answers: updatedAnswers };
      })
      setIsAddAnsClicked(false);
      setIsExpanded(false);
    }
  }

  // DELETE QUESTION
  async function handleDelQst () {
    const oldQsts = quiz.questions;
    oldQsts.splice(qstIndex, 1);
    setQuiz({ ...quiz, questions: oldQsts });
    const result = await api(`admin/quiz/${quizId}`, 'PUT', quiz, currentUser);
    // console.log(result);
    if (result.status === 200) {
      navigate(`/admin/quiz/${quizId}`);
    } else {
      setError(result.data.error);
    }
  }

  function handleQstLmtTmeChng (e) {
    setSaveButtonStatus(true);
    setQst({ ...qst, time: e.target.value });
  }

  function handleError (error) {
    setError(error);
    setSnackBar(true);
  }

  function handleQstPntsChng (e) {
    setSaveButtonStatus(true);
    setQst({ ...qst, points: e.target.value });
  }

  function handleQstAnsOptChng (e) {
    const qstType = e.target.value;
    let checkedBoxes = 0;
    for (const answer of qst.answers) {
      if (answer.isAnswer) {
        checkedBoxes++;
      }
    }
    /* user has multiple right answers,
      but is going to set question type to single select
    */
    if (qstType === 'single' && checkedBoxes > 1) {
      handleError('Please reduce to ONLY 1 right answer first');
      return;
    }
    setSaveButtonStatus(true);
    setQst({ ...qst, type: qstType });
  }

  return (
    <Grid sx={{ height: '98vh' }}>
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
            <Button variant="contained" color='info' href={`/admin/quiz/${quizId}`}>Summary</Button>
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

        {/* Central Panel */}
        <Grid item md={8} mt={3} mb={2}
          sx={{
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
            px: 2,
          }}>
          <Stack spacing={1}>
            <Typography variant="h4" align="center" gutterBottom>
              Question {Number(qstIndex) + 1}
            </Typography>

            <Stack spacing={3}>
              {/* Upload photo, question, link input */}
              <Grid container spacing={0}>

                {/* Photo upload */}
                <Grid item md={4} sx={{ px: 2 }}>
                  <Input type="file" id="img" onChange={handleFileChng} sx={{ display: 'none' }}/>
                  {qst.img
                    ? (
                      <Thumbnail htmlFor="img">
                        <StyledImg src={qst.img} alt="Preview" htmlFor="img"/>
                      </Thumbnail>
                      )
                    : (
                      <Thumbnail htmlFor="img">
                        <p>Upload photo</p>
                      </Thumbnail>
                      )}
                </Grid>

                {/* Question, link input */}
                <Grid item md={8} sx={{ px: 2 }}>
                  <Stack spacing={3}>
                    {/* Question Title */}
                    <StyledInput
                      label={'Question'}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={qst.title}
                      onChange={(e) => handleQstTitleChng(e)}
                    />
                    <StyledInput
                      label={'Reference Link'}
                      variant="outlined"
                      fullWidth
                      size='small'
                      value={qst.link}
                      onChange={(e) => handleQstLinkChng(e)}
                    />
                  </Stack>

                </Grid>

              </Grid>

              {/* Answers, Bottom Buttons */}
              <Grid container spacing={0}>
                  <Grid item md={6} sx={{ px: 2 }}>
                    <StyledInput
                      label={'Answer A'}
                      variant="outlined"
                      fullWidth
                      value={qst.answers[0].content}
                      onChange={(e) => handleQstAnsChng(0, e)}
                    />
                    <FormControlLabel control={<Checkbox checked={qst.answers[0].isAnswer} onChange={(e) => handleQstRghtAnsClicked(0, e)} /> } label="Correct Answer" />
                  </Grid>

                  <Grid item md={6} sx={{ px: 2 }}>
                    <StyledInput
                      label={'Answer B'}
                      variant="outlined"
                      fullWidth
                      value={qst.answers[1].content}
                      onChange={(e) => handleQstAnsChng(1, e)}
                    />
                    <FormControlLabel control={<Checkbox checked={qst.answers[1].isAnswer} onChange={(e) => handleQstRghtAnsClicked(1, e)} /> } label="Correct Answer" />
                  </Grid>

                  <Grid item md={6} sx={{ px: 2 }}>
                    <StyledInput
                      label={'Answer C'}
                      variant="outlined"
                      fullWidth
                      value={qst.answers[2].content}
                      onChange={(e) => handleQstAnsChng(2, e)}
                    />
                    <FormControlLabel control={<Checkbox checked={qst.answers[2].isAnswer} onChange={(e) => handleQstRghtAnsClicked(2, e)} /> } label="Correct Answer" />
                  </Grid>

                  <Grid item md={6} sx={{ px: 2 }}>
                    <StyledInput
                      label={'Answer D'}
                      variant="outlined"
                      fullWidth
                      value={qst.answers[3].content}
                      onChange={(e) => handleQstAnsChng(3, e)}
                    />
                    <FormControlLabel control={<Checkbox checked={qst.answers[3].isAnswer} onChange={(e) => handleQstRghtAnsClicked(3, e)} /> } label="Correct Answer" />
                  </Grid>

                  {isExpanded && (
                    <>
                      <Grid item md={6} sx={{ px: 2 }}>
                        <StyledInput
                          label={'Answer E'}
                          variant="outlined"
                          fullWidth
                          value={qst.answers[4].content}
                          onChange={(e) => handleQstAnsChng(4, e)}
                        />
                        <FormControlLabel control={<Checkbox checked={qst.answers[4].isAnswer} onChange={(e) => handleQstRghtAnsClicked(4, e)}/> } label="Correct Answer" />
                      </Grid>

                      <Grid item md={6} sx={{ px: 2 }}>
                        <StyledInput
                          label={'Answer F'}
                          variant="outlined"
                          fullWidth
                          value={qst.answers[5].content}
                          onChange={(e) => handleQstAnsChng(5, e)}
                        />
                        <FormControlLabel control={<Checkbox checked={qst.answers[5].isAnswer} onChange={(e) => handleQstRghtAnsClicked(5, e)}/> } label="Correct Answer" />
                      </Grid>
                    </>
                  )}

                  {/* Buttons */}
                  <Grid item md={12} sx={{ px: 2, py: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <Button variant={buttonVariant} startIcon={<CheckIcon />} onClick={() => handleUpdateQst()} color="success" disabled={isSaveClicked}>
                        {isSaveClicked ? 'SAVED' : 'SAVE'}
                      </Button>

                      <Button variant="outlined" startIcon={<Add />} onClick={() => handleAddAnsClicked()}>
                        {isAddAnsClicked ? 'Cancel 2 more answers' : 'Add 2 more answers' }
                      </Button>

                      <Button variant="outlined" color="error" startIcon={<Delete />}onClick={() => handleDelQst()}>
                        Delete this question
                      </Button>
                    </Stack>
                  </Grid>
              </Grid>
            </Stack>

          </Stack>
        </Grid>

        {/* Right Panel */}
        <Grid item md={2} mt={10} sx={{ px: 6 }}>
          <Stack spacing={3} direction="column" alignItems="center">

            <Typography variant="h6" align="center" gutterBottom>Question Info</Typography>

            <StyledSelect fullWidth>
              <InputLabel>Limit Time</InputLabel>
              <Select
                size='small'
                label="Limit Time"
                value={qst.time}
                onChange={handleQstLmtTmeChng}
              >
                <MenuItem value={5}>5 secs</MenuItem>
                <MenuItem value={10}>10 secs</MenuItem>
                <MenuItem value={20}>20 secs</MenuItem>
                <MenuItem value={30}>30 secs</MenuItem>
                <MenuItem value={60}>1 min</MenuItem>
                <MenuItem value={90}>1 min 30 secs</MenuItem>
                <MenuItem value={120}>2 mins</MenuItem>
                <MenuItem value={180}>3 mins</MenuItem>
                <MenuItem value={240}>4 mins</MenuItem>
              </Select>
            </StyledSelect>

            <StyledSelect fullWidth>
              <InputLabel>Points</InputLabel>
              <Select
                size='small'
                label="Points"
                value={qst.points}
                onChange={handleQstPntsChng}
              >
                <MenuItem value={3}>3 Points</MenuItem>
                <MenuItem value={5}>5 Points</MenuItem>
                <MenuItem value={10}>10 Points</MenuItem>
              </Select>
            </StyledSelect>

            <StyledSelect fullWidth>
              <InputLabel>Answer options</InputLabel>
              <Select
                size='small'
                label="Answer options"
                value={qst.type}
                onChange={handleQstAnsOptChng}
              >
                <MenuItem value={'single'}>Single select</MenuItem>
                <MenuItem value={'multi'}>Multi-select</MenuItem>
              </Select>
            </StyledSelect>

          </Stack>
        </Grid>

      </Grid>
      </Grid>

  );
}

export default Question;
