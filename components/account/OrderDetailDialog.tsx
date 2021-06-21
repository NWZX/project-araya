import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Grid,
    IconButton,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Typography,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { formatCurrencyString } from 'use-shopping-cart';
import { IOrderRecipe } from 'interfaces';

interface Props {
    order?: {
        displayName: string;
        recipe: IOrderRecipe;
        actionTitle?: string;
        onClick?: () => void;
    };
    onClose: () => void;
}

const OrderDetailDialog = ({ order, onClose }: Props): JSX.Element => {
    return (
        <Dialog open={Boolean(order)} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock>
            <DialogTitle>
                <Grid container>
                    <Grid item container justify="flex-start" xs={10}>
                        <Grid item>Commande de &quot;{order?.displayName}&quot;</Grid>
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
                    {order?.onClick && order.actionTitle && (
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                fullWidth
                                endIcon={<ArrowForwardIcon />}
                                onClick={order?.onClick}
                            >
                                {order?.actionTitle}
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {order?.recipe.item.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell align="left">
                                                <Typography variant="body1">
                                                    x{row.qty} {row.name}
                                                </Typography>
                                                {row.option?.map((v) => {
                                                    return (
                                                        <Typography key={v} component="div" variant="caption">
                                                            {v}
                                                        </Typography>
                                                    );
                                                })}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrencyString({
                                                    currency: 'eur',
                                                    value: row.total,
                                                    language: 'fr',
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailDialog;
