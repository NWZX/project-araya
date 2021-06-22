import React from 'react';
import { Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ReviewItem from './ReviewItem';
import SendReview from './SendReview';
import { IStoreReview } from 'interfaces';
import { useDialogData } from 'interfaces/StoreDialogContext';

import firebase from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

interface Props {}

const ReviewDialog: React.FC<Props> = () => {
    const { currentDialog, storeId, closeDialog } = useDialogData();
    const [data] = useCollectionData<IStoreReview>(
        storeId ? firebase.firestore().collection('reviews').where('storeId', '==', storeId) : undefined,
        {
            idField: 'id',
            refField: 'ref',
        },
    );

    const handleClose = (): void => {
        closeDialog();
    };

    return (
        <Dialog open={currentDialog == 'review'} onClose={handleClose} fullScreen>
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
                    <Grid item xs={12} style={{ marginBottom: '1rem' }}>
                        <SendReview storeId={storeId} />
                    </Grid>
                    <Grid item xs={12} style={{ marginBottom: '1rem' }}>
                        <Divider variant="fullWidth" />
                    </Grid>
                    <Grid item container justify="flex-end" spacing={2} style={{ maxHeight: '60%', overflowY: 'auto' }}>
                        {data?.map((v) => (
                            <Grid item xs={12} key={v.id}>
                                <ReviewItem {...v} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDialog;
