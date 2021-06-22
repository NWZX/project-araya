import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Grid } from '@material-ui/core';
import React from 'react';
import { IProductGroup } from 'interfaces';
import { useDialogData } from 'interfaces/StoreDialogContext';
import { fetchPostJSON } from 'utils/apiHelpers';

interface Props {}

const ProductGroupDelDialog = ({}: Props): JSX.Element => {
    const { currentDialog, selectedGroup, closeDialog } = useDialogData();

    const handleClose = (): void => {
        closeDialog();
    };
    const onSubmit = async (): Promise<void> => {
        if (selectedGroup) {
            const result = await fetchPostJSON<{ group: IProductGroup }, { result: boolean }>(
                '/api/productGroups/delete',
                { group: selectedGroup },
            );
            result && handleClose();
        }
    };

    return (
        <form>
            <Dialog open={currentDialog == 'del-product-group'} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">
                    Suppresion du groupe &quot;{selectedGroup?.title}&quot;
                </DialogTitle>
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
