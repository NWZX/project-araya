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
import { useDialogData } from 'interfaces/DialogDataContext';

interface Props {}

const ProductGroupAddDialog = ({}: Props): JSX.Element => {
    const { currentDialog, closeDialog } = useDialogData();
    const [title, setTitle] = useState('');

    const handleClose = (): void => {
        closeDialog();
    };
    // const onSubmit = (): void => {
    //     handleClose();
    // };

    return (
        <form>
            <Dialog open={currentDialog == 'add-product-group'} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">Crée un groupe</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <DialogContentText>Exemple: Entrée, Plat, Dessert, Boisson...</DialogContentText>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default ProductGroupAddDialog;
