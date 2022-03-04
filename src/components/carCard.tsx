import { CarModel } from "../../api/Car";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { makeStyles } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Link from "next/link";

export interface CarCardProps {
    car: CarModel;
}

const useStyles = makeStyles((theme) => ({
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
    anchorTag: {
        textDecoration: 'none'
    }
  }));  

export function CarCard({ car }: CarCardProps) {
    const classes = useStyles();

    return (
        <Link href="/car/[make]/[brand]/[id]" as={`/car/${car.make}/${car.model}/${car.id}`}>
            <a className={classes.anchorTag}>
                <Card elevation={5}>
                    <CardHeader
                    avatar={
                        <Avatar className={classes.avatar} aria-label="recipe">
                        R
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                        <MoreVertIcon />
                        </IconButton>
                    }
                    title={`${car.make} ${car.model}`}
                    subheader={`$${car.price}`}
                    />
                    <CardMedia
                    component="img"
                    height="194"
                    image={car.photoUrl}
                    alt={car.model}
                    />
                    <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {car.details}
                    </Typography>
                    </CardContent>
                </Card>
            </a>
        </Link>
    )
}