import { Dialog, DialogTitle, DialogContent, Button, Grid, IconButton, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import firebase from 'firebase';
import { useAuthUser } from 'next-firebase-auth';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

interface Props {
    open?: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PasswordRequestDialog = ({ open = false, onClose, onSuccess }: Props): JSX.Element => {
    const { enqueueSnackbar } = useSnackbar();
    const user = useAuthUser();
    const [password, setPassword] = useState('');
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
            <DialogTitle>
                <Grid container alignItems="center">
                    <Grid item container justify="flex-start" xs={10}>
                        <Grid item>Confirmation</Grid>
                    </Grid>
                    <Grid item container justify="flex-end" xs={2}>
                        <Grid item>
                            <IconButton onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            type="password"
                            variant="outlined"
                            placeholder="Password"
                            name="password"
                            fullWidth
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={async () => {
                                try {
                                    if (user.email) {
                                        await firebase.auth().signInWithEmailAndPassword(user.email, password);
                                        onSuccess();
                                    }
                                } catch (error) {
                                    enqueueSnackbar(error.message, { variant: 'error' });
                                    onClose();
                                } finally {
                                    setPassword('');
                                }
                            }}
                        >
                            Valider
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default PasswordRequestDialog;
