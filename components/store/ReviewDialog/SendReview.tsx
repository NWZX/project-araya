import React, { useState } from 'react';
import { Grid, Typography, TextField, IconButton, makeStyles, createStyles } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import SendIcon from '@material-ui/icons/Send';
import { useAuthUser } from 'next-firebase-auth';
import firebase from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { IStoreReview } from 'interfaces';
import { useEffect } from 'react';

const useStyles = makeStyles(() =>
    createStyles({
        itemFullWidth: {
            flexGrow: 1,
        },
    }),
);

interface Props {
    storeId?: string;
}

const SendReview: React.FC<Props> = ({ storeId }) => {
    const classes = useStyles();
    const user = useAuthUser();

    const [data] = useCollectionData<IStoreReview>(
        user.id && storeId
            ? firebase.firestore().collection('reviews').where('authId', '==', user.id).where('storeId', '==', storeId)
            : undefined,
        {
            idField: 'id',
            refField: 'ref',
        },
    );

    const [rate, setRate] = useState(2.5);
    const [comment, setComment] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (data) {
            setComment(data[0]?.comment || '');
            setRate(data[0]?.rate || 2.5);
        }
    }, [data]);

    const handleSubmit = async (): Promise<void> => {
        try {
            setSending(true);
            if (user.id) {
                console.log('yes');
                if (data && data.length > 0) {
                    //Update the existing review
                    data[0]?.ref?.set(
                        {
                            comment,
                            rate,
                            updatedAt: firebase.firestore.Timestamp.now().toMillis(),
                        },
                        { merge: true },
                    );
                } else {
                    // Create review if not already existing
                    await firebase
                        .firestore()
                        .collection('reviews')
                        .add({
                            authId: user.id,
                            author: user.displayName,
                            storeId,
                            comment,
                            rate,
                            createdAt: firebase.firestore.Timestamp.now().toMillis(),
                        } as Partial<IStoreReview>);
                }
            }
            setSending(false);
        } catch (error) {
            console.error(error.message);
        }
    };

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
                        <Rating
                            name="half-rating"
                            defaultValue={2.5}
                            precision={0.5}
                            value={rate}
                            onChange={(_, v) => v && setRate(v)}
                        />
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
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <IconButton onClick={handleSubmit} disabled={sending}>
                        <SendIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SendReview;
