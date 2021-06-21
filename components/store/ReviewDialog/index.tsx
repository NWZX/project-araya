import React from 'react';
import { Dialog, DialogContent, DialogTitle, Grid, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ReviewItem from './ReviewItem';
import SendReview from './SendReview';
import { useDialogData } from 'interfaces/DialogDataContext';

interface Props {}

const ReviewDialog: React.FC<Props> = () => {
    const dialogContext = useDialogData().review;
    const setReview = dialogContext?.[1];

    const handleClose = (): void => {
        setReview && setReview(undefined);
    };

    return (
        <Dialog open={Boolean(dialogContext?.[0])} onClose={handleClose} fullScreen>
            <DialogTitle id="form-dialog-title">
                <Grid container>
                    <Grid item container xs={10} justify="flex-start" alignContent="center">
                        <Grid item>Avis</Grid>
                    </Grid>
                    <Grid item container xs={2} justify="flex-end" alignContent="center">
                        <Grid item>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item container justify="flex-end" spacing={2} style={{ height: '60vh', overflowY: 'scroll' }}>
                        <Grid item xs={12}>
                            <ReviewItem />
                        </Grid>
                        <Grid item xs={11}>
                            <ReviewItem isResponse />
                        </Grid>
                        <Grid item xs={12}>
                            <ReviewItem />
                        </Grid>
                        <Grid item xs={12}>
                            <ReviewItem />
                        </Grid>
                        <Grid item xs={12}>
                            <ReviewItem />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: '2rem' }}>
                        <SendReview />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDialog;
