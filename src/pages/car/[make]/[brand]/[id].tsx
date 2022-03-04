import React from 'react';
import { GetServerSideProps } from 'next';
import { openDB } from '../../../../openDB';
import { CarModel } from '../../../../../api/Car';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

interface CarDetailsProps {
    car: CarModel | null | undefined,
}

const Img = styled('img')({ 
    maxWidth: '100%'
  });

const CarDetails = ({ car }: CarDetailsProps) => {
    if(!car) {
        return <h1>Sorry, car not found!</h1>
    }
    return (
      <div>
        <Head>
          <title>{`${car.make} ${car.model}`}</title>
        </Head>
        <Paper
        sx={{
          p: 2,
          margin: 'auto',
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={5}>
              <Img alt="complex" src={car.photoUrl} />
            </Grid>
            <Grid item xs={12} sm={6} md={7} container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="h5">
                    {`${car.make} ${car.model}`}
                  </Typography>
                  <Typography gutterBottom variant="h4">
                    ${car.price}
                  </Typography>
                  <Typography gutterBottom variant="body2" color="text.secondary">
                    Year: {car.year}
                  </Typography>
                  <Typography gutterBottom variant="body2" color="text.secondary">
                    KMs: {car.kilometers}
                  </Typography>
                  <Typography gutterBottom variant="body1" color="text.secondary">
                    Fuel Type : {car.fuelType}
                  </Typography>
                  <Typography gutterBottom variant="body2" color="text.secondary">
                    Details: {car.details}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // console.log(context);
    const id = context.query.id;
    const db = await openDB();
    const car = await db.get(`SELECT * FROM Car where id = ${id}`);
    console.log(car);
    
    
    return {
        props: {
            car: car || null,
        }
    }
};

export default CarDetails;