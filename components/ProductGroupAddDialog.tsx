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
import React, { useContext, useState } from 'react';
import { DialogDataContext } from '../interfaces';

interface Props {}

const ProductGroupAddDialog = ({}: Props): JSX.Element => {
    const dialogContext = useContext(DialogDataContext);
    const open = dialogContext.addGroup?.[0];
    const setOpen = dialogContext.addGroup?.[1];
    const [title, setTitle] = useState('');

    const handleClose = (): void => {
        setOpen && setOpen(false);
    };
    // const onSubmit = (): void => {
    //     handleClose();
    // };

    return (
        <form>
            <Dialog open={Boolean(open)} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">Création d&apos;un groupe</DialogTitle>
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
