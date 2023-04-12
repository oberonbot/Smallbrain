import React from 'react'
import MyAppBar from '../Components/MyAppBar'
import { Container, Divider, Typography } from '@mui/material'
import MyCarousel from '../Components/MyCarousel'
import styled from 'styled-components'

const gamesInfo = [[
  {
    title: 'Overwatch',
    img: '/static/images/photos/overwatch.jpg',
    content: 'Lorem ipsum dolor sit amet.'
  }, {
    title: 'Elden Ring',
    img: '/frontend/public/static/images/photos/eldenring.jpg',
    content: 'Consectetur adipiscing elit.'
  }, {
    title: 'Genshin Impact',
    img: '/frontend/public/static/images/photos/genshinimpact.jpeg',
    content: 'Sed do eiusmod tempor incididunt.'
  }
]]

const MyContainer = styled(Container)`
  padding-top: 30px;
`;

const DashBoard = () => {
  return (
    <>
        <MyAppBar></MyAppBar>
        <MyContainer maxWidth="xl">
          <Typography variant="h4" component="h2">
            Games
          </Typography>
          <Divider></Divider>
          <MyCarousel items={gamesInfo}></MyCarousel>
        </MyContainer>
    </>
  )
}

export default DashBoard
