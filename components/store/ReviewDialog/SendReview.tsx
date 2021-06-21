import React from 'react';
import { Grid, Typography, TextField, IconButton, makeStyles, createStyles } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(() =>
    createStyles({
        itemFullWidth: {
            flexGrow: 1,
        },
    }),
);

interface Props {}

const SendReview: React.FC<Props> = () => {
    const classes = useStyles();

    return (
        <Grid container justify="center" alignItems="center">
            <Grid item container xs={12} spacing={1}>
                <Grid item>
                    <Typography align="left" component="div">
                        Notes :
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography align="left" component="div">
                        <Rating name="half-rating" defaultValue={2.5} precision={0.1} />
                    </Typography>
                </Grid>
            </Grid>
            <Grid item container xs={12} spacing={1} alignItems="center">
                <Grid item className={classes.itemFullWidth}>
                    <TextField
                        variant="outlined"
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="(Optionel) Votre avis à propos de ce restaurant..."
                    />
                </Grid>
                <Grid item>
                    <IconButton>
                        <SendIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SendReview;
