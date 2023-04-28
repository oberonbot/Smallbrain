import { Box, Button, Container, Link, Stack, TextField, Typography, Alert, useMediaQuery } from '@mui/material'
import { React, useState } from 'react'
import styled from 'styled-components'
import Typewritter from '../Components/Typewritter';
import api from '../utils';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';

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

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);

  const handleRegister = async () => {
    const result = await api('admin/auth/register', 'POST', { email, password, name }, undefined);
    if (result.status === '200') {
      navigate('/login')
    } else {
      setError(result.data.error);
    }
  };

  return (
    <Container>
      <Stack pt={10} alignItems="center">
        <StyledBox>
          <Typography variant={isSmallScreen ? 'h5' : 'h4'} component="h2">
            <Typewritter text="Welcome to GameStop!" />
          </Typography>
        </StyledBox>
        <Typography variant="h4" component="h2" pt={5}>
              Register
        </Typography>
        <Stack sx={{ width: '300px' }} spacing={3} pt={5} alignItems="center">
          <StyledInput
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={handleEmailChange}
          />
        <StyledInput
            label="Username"
            variant="outlined"
            fullWidth
            value={name}
            onChange={handleNameChange}
          />
          <StyledInput
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
          />
          {error && <Alert severity="error" variant='outlined'>{error}</Alert>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            fullWidth
            sx={{ height: '50px' }}
          >
            Register
          </Button>
          <br />

          <Link href="/login">
            {'Already have an account? Login here'}
          </Link>

        </Stack>
      </Stack>
    </Container>
  )
}

export default Register
