import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Avatar, Box, Card, CardContent, Grid, Typography, colors, makeStyles } from '@material-ui/core';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import MoneyIcon from '@material-ui/icons/Money';
import { fetchPostJSON } from '../../utils/apiHelpers';
import { useSnackbar } from 'notistack';
import Stripe from 'stripe';
import { Skeleton } from '@material-ui/lab';
import { formatCurrencyString } from 'use-shopping-cart';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
    },
    avatar: {
        backgroundColor: colors.red[600],
        height: 56,
        width: 56,
    },
    differenceIcon: {
        color: colors.yellow[700],
    },
    differenceValue: {
        color: colors.yellow[700],
        marginRight: theme.spacing(1),
    },
}));

interface IBudget {
    className?: string;
}

const Budget = ({ className }: IBudget): JSX.Element => {
    const classes = useStyles();
    const [balance, setBalance] = useState<Stripe.Balance | undefined>();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function dataFetch(): Promise<void> {
            try {
                const result = await fetchPostJSON<undefined, Stripe.Balance | undefined>(`/api/stores/balance`);
                setBalance(result);
            } catch (error) {
                enqueueSnackbar(error.message, { variant: 'error' });
            }
        }
        dataFetch();
    }, [enqueueSnackbar]);

    return (
        <Card className={clsx(classes.root, className)}>
            <CardContent>
                <Grid container justify="space-between" spacing={3}>
                    <Grid item>
                        <Typography color="textSecondary" gutterBottom variant="h6">
                            {balance ? 'PORTEFEUILLE' : <Skeleton width={120} />}
                        </Typography>
                        <Typography color="textPrimary" variant="h3">
                            {balance ? (
                                formatCurrencyString({
                                    currency: balance.available?.[0].currency || 'eur',
                                    language: 'fr',
                                    value: balance.available?.[0].amount || 0,
                                })
                            ) : (
                                <Skeleton width={90} />
                            )}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <MoneyIcon />
                        </Avatar>
                    </Grid>
                </Grid>
                <Box mt={2} display="flex" alignItems="center">
                    {balance && <HourglassEmptyIcon className={classes.differenceIcon} />}
                    <Typography className={classes.differenceValue} variant="body2">
                        {balance ? (
                            formatCurrencyString({
                                currency: balance.pending?.[0].currency || 'eur',
                                language: 'fr',
                                value: balance.pending?.[0].amount || 0,
                            })
                        ) : (
                            <Skeleton width={150} />
                        )}
                    </Typography>
                    {balance && (
                        <Typography color="textSecondary" variant="caption">
                            En cours de traitement
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default Budget;
