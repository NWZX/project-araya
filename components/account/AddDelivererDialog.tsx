import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Grid,
    TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAccountDialog } from 'interfaces/AccountDialogContext';
import firebase from 'firebase';
import { useAuthUser } from 'next-firebase-auth';
import { IDeliverer } from 'interfaces';

interface Props {}

const AddDelivererDialog: React.FC<Props> = () => {
    const user = useAuthUser();
    const { enqueueSnackbar } = useSnackbar();
    const { currentDialog, closeDialog } = useAccountDialog();
    console.log(currentDialog);
    const [delivererCode, setDelivererCode] = useState('');

    const handleClose = (): void => {
        setDelivererCode('');
        closeDialog();
    };
    const handleSubmit = async (): Promise<void> => {
        try {
            if (user.id) {
                const deliverers = await firebase
                    .firestore()
                    .collection('deliverers')
                    .where('delivererCode', '==', delivererCode)
                    .get();
                if (deliverers.empty) {
                    enqueueSnackbar('Aucun livreur correspondant !', { variant: 'error' });
                } else {
                    const deliverer = {
                        ...(deliverers.docs[0].data() as IDeliverer),
                        id: deliverers.docs[0].id,
                        ref: deliverers.docs[0].ref,
                    };
                    console.log(deliverer);
                    if (deliverer.storeIds?.find((s) => s == user.id)) {
                        enqueueSnackbar('Livreur déjà enregister !', { variant: 'error' });
                    } else {
                        await deliverer.ref.set(
                            { storeIds: firebase.firestore.FieldValue.arrayUnion(user.id) },
                            { merge: true },
                        );
                        enqueueSnackbar('Livreur ajouter !', { variant: 'success' });
                    }
                }
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'success' });
        } finally {
            handleClose();
        }
    };

    return (
        <form>
            <Dialog open={currentDialog == 'add-deliverer'} onClose={handleClose} disableScrollLock>
                <DialogTitle id="form-dialog-title">Recherche de livreur</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <DialogContentText>Code du livreur</DialogContentText>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="delivererCode"
                                value={delivererCode}
                                onChange={(e) => setDelivererCode(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default AddDelivererDialog;
