import { useContext, useState, React } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert, Avatar, Grid, Modal, Snackbar, Stack, TextField } from '@mui/material';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
// import api from '../utils';
import styled from 'styled-components';
import api from '../utils';

// const pages = [
//   'dashboard', 'history', 'create', 'join a game'
// ];

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 24px;
  padding: 16px;
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

function MyAppBar () {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [snackbar, setSnackBar] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [quizName, setQuizName] = useState('');
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfile = () => {};

  const handleLogout = async (e) => {
    e.preventDefault();
    const result = await logout();
    if (result.status === 200) {
      navigate('/');
    } else {
      setError(result.data.error);
      setSnackBar(true);
    }
  };

  async function handleCreateGame () {
    const result = await api('admin/quiz/new', 'POST', { name: quizName }, currentUser);
    // console.log(result);
    if (result.status === 200) {
      const quizId = result.data.quizId;
      navigate(`/admin/quiz/${quizId}`);
    } else {
      setError(result.data.error);
    }
  }

  return (
    <AppBar position="static">
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <Stack spacing={1} alignItems={'center'} >
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Enter the title of the quiz
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={8} xs={10}>
                <StyledInput
                  label={'Question'}
                  variant="outlined"
                  fullWidth
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  size='small'
                />
              </Grid>
              <Grid item md={4} xs={10}>
                <Button variant="outlined" startIcon={<CheckIcon />} onClick={() => handleCreateGame()} color="success" sx={{ height: '100%' }}>
                  Confirm
                </Button>
              </Grid>
            </Grid>

          </Stack>

        </StyledBox>
      </Modal>

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
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <SportsEsportsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              color: 'white',
              fontFamily: 'Roboto',
              fontWeight: 700,
              letterSpacing: '.1rem',
              textDecoration: 'none',
            }}
          >
            GameStop
          </Typography>

          {/* Mobile Device View */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(e) => { setAnchorElNav(e.currentTarget) }}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => { setAnchorElNav(null) }}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >

              <MenuItem onClick={() => { navigate('/') }}>
                <Typography textAlign="center">DashBoard</Typography>
              </MenuItem>
              <MenuItem onClick={() => setModal(true)}>
                <Typography textAlign="center">Create</Typography>
              </MenuItem>

            </Menu>
          </Box>
          <SportsEsportsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Roboto',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            GameStop
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => { navigate('/') }}
              >
              Dashboard
              </Button>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => setModal(true)}
              >
              Create
              </Button>
              {/* <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => setModal(true)}
              >
              Join a game
              </Button> */}
          </Box>

          {/* Avatar Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={(e) => { setAnchorElUser(e.currentTarget) }} sx={{ p: 0 }}>
                <Avatar alt="Username" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={() => { setAnchorElUser(null) }}
            >
            <MenuItem onClick={handleProfile}>
              <Typography textAlign="center" >Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Log out</Typography>
            </MenuItem>
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default MyAppBar;
