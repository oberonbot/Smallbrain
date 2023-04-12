import { Grid } from '@mui/material'
import React from 'react'
import MyCard from './MyCard'
import styled from '@emotion/styled'

const Games = styled.div`
  padding-top: 30px;
`;

const MyCarousel = ({ items }) => {
  console.log(items);
  return (
    <Games>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <MyCard cardInfo={items[0]}></MyCard>
        </Grid>
        {/* <Grid item xs={3}>
          <MyCard></MyCard>
        </Grid>
        <Grid item xs={3}>
          <MyCard></MyCard>
        </Grid>
        <Grid item xs={3}>
          <MyCard></MyCard>
        </Grid> */}
      </Grid>
    </Games>
  )
}

export default MyCarousel
