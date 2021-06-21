import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import React from 'react';

interface Props {
    isResponse?: boolean;
}

const ReviewItem: React.FC<Props> = ({ isResponse }) => {
    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid container item xs={12}>
                        <Grid container item xs={8} justify="flex-start" alignItems="center">
                            <Grid item>
                                <Typography variant="button" component="p">
                                    Jack
                                </Typography>
                            </Grid>
                        </Grid>
                        {!isResponse && (
                            <Grid container item xs={4} justify="flex-end" alignItems="center">
                                <Grid item>
                                    <Typography align="center" component="div">
                                        <Rating name="half-rating" defaultValue={2.5} precision={0.1} readOnly />
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption">12/04/2020</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ReviewItem;
