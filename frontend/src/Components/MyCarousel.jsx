import { Grid } from '@mui/material'
import React from 'react'
import MyCard from './MyCard'

const MyCarousel = ({ items }) => {
  // console.log(items);
  return (

      <Grid container spacing={3} pt={4}>
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={2.4} key={index}>
          <MyCard card={item}></MyCard>
        </Grid>
      ))}
      </Grid>

  )
}

export default MyCarousel
