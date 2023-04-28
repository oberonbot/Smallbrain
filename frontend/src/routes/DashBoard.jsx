import React, { useContext, useEffect, useState } from 'react'
import MyAppBar from '../Components/MyAppBar'
import { Alert, Container, Divider, Snackbar, Typography } from '@mui/material'
import MyCarousel from '../Components/MyCarousel'
import styled from 'styled-components'
import { AuthContext } from '../authContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils'

const MyContainer = styled(Container)`
  padding-top: 30px;
`;

const DashBoard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [snackbar, setSnackBar] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (currentUser === null) {
      navigate('/login');
    }
    const fetchData = async () => {
      const result = await api('admin/quiz', 'GET', undefined, currentUser);
      // console.log(result);
      if (result.status === 200) {
        setQuizzes(result.data.quizzes);
      } else {
        setError(result.data.error);
      }
    };
    fetchData();
    // console.log(quizzes);
  }, [currentUser, navigate]);

  return (
      <>
        <MyAppBar></MyAppBar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={6000}
          open={snackbar}
          onClose={() => { setSnackBar(false) }}
        >
          <Alert severity="error" sx={{ width: '100%' }} variant='filled'>
            {error}
          </Alert>
        </Snackbar>
        <MyContainer maxWidth="xl">
          <Typography variant="h4" component="h2">
            DashBoard
          </Typography>
          <Divider></Divider>
          <MyCarousel items={quizzes}></MyCarousel>
        </MyContainer>
      </>
  )
}

export default DashBoard
