import { Button } from '@material-ui/core';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { IStoreReview } from 'interfaces';
import React from 'react';

interface Props extends IStoreReview {
    isResponse?: boolean;
}

const ReviewItem: React.FC<Props> = ({ author, rate, comment, createdAt, updatedAt, isResponse }) => {
    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid container item xs={12}>
                        <Grid container item xs={8} justify="flex-start" alignItems="center">
                            <Grid item>
                                <Typography variant="button" component="p">
                                    {author}
                                </Typography>
                            </Grid>
                        </Grid>
                        {!isResponse && (
                            <Grid container item xs={4} justify="flex-end" alignItems="center">
                                <Grid item>
                                    <Typography align="center" component="div">
                                        <Rating name="half-rating" defaultValue={rate} precision={0.5} readOnly />
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">{comment}</Typography>
                    </Grid>
                    <Grid item container xs={12}>
                        <Grid item xs={6} alignItems="center" style={{ alignSelf: 'center' }}>
                            <Typography variant="caption">
                                {updatedAt
                                    ? `Mis à jour le ${new Date(updatedAt).toLocaleDateString()}`
                                    : `Publier le ${new Date(createdAt).toLocaleDateString()}`}
                            </Typography>
                        </Grid>
                        <Grid item container xs={6} justify="flex-end">
                            <Button>Repondre</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ReviewItem;
