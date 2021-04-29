import React from 'react';
import clsx from 'clsx';
import { Avatar, Card, CardContent, Grid, Typography, makeStyles, colors } from '@material-ui/core';
import firebase from 'firebase';
import { useAuthUser } from 'next-firebase-auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Skeleton } from '@material-ui/lab';
import Inventory from '../Icons/Inventory';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
    },
    avatar: {
        backgroundColor: colors.indigo[600],
        height: 56,
        width: 56,
    },
}));

interface ITotalProfit {
    className?: string;
}

const TotalOrders = ({ className }: ITotalProfit): JSX.Element => {
    const classes = useStyles();
    const user = useAuthUser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firestoreScope = (): any => {
        const claims = (user?.claims as unknown) as
            | { admin: boolean; accessLevel: number; name: string; phone_number: string }
            | undefined;
        if (claims?.admin) return firebase.firestore().collection('orders');
        else if (claims?.accessLevel === 2)
            return firebase.firestore().collection('orders').where('storeId', '==', user.id);
        else if (claims?.accessLevel === 5)
            return firebase.firestore().collection('orders').where('customerId', '==', user.id);
        else return undefined;
    };
    const [data] = useCollection(firestoreScope());

    return (
        <Card className={clsx(classes.root, className)}>
            <CardContent>
                <Grid container justify="space-between" spacing={3}>
                    <Grid item>
                        <Typography color="textSecondary" gutterBottom variant="h6">
                            {data ? 'PRODUITS' : <Skeleton width={90} />}
                        </Typography>
                        <Typography color="textPrimary" variant="h3">
                            {data ? data.size : <Skeleton width={30} />}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <Inventory />
                        </Avatar>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default TotalOrders;
