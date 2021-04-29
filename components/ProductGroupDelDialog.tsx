import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import { DialogDataContext, IProductGroup } from '../interfaces';
import { fetchPostJSON } from '../utils/apiHelpers';

interface Props {}

const ProductGroupDelDialog = ({}: Props): JSX.Element => {
    const dialogContext = useContext(DialogDataContext);
    const group = dialogContext.delGroup?.[0];
    const setGroup = dialogContext.delGroup?.[1];

    const handleClose = (): void => {
        setGroup && setGroup(undefined);
    };
    const onSubmit = async (): Promise<void> => {
        if (group) {
            const result = await fetchPostJSON<{ group: IProductGroup }, { result: boolean }>(
                '/api/productGroups/delete',
                { group },
            );
            result && handleClose();
        }
    };

    return (
        <form>
            <Dialog open={Boolean(group)} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">Suppresion du groupe &quot;{group?.title}&quot;</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <DialogContentText>Etes-vous sur de vouloir supprimer ce groupe ?</DialogContentText>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Non
                    </Button>
                    <Button onClick={onSubmit} color="primary">
                        Oui
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default ProductGroupDelDialog;
