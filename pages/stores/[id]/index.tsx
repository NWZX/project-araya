import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AuthAction, withAuthUser } from 'next-firebase-auth';
import useSWR from 'swr';

import { Grid, makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import { IProductGroup, IStore } from 'interfaces';
import { StoreDialogProvider } from 'interfaces/StoreDialogContext';
import { fetchGetJSON } from 'utils/apiHelpers';

import { useShoppingCart } from 'use-shopping-cart';

import Layout from 'components/Layout';
import PayementRecipe from 'components/PayementRecipe';
import ProductList from 'components/store/ProductList';
import ProductDetailDialog from 'components/store/ProductDetailDialog';
import ReviewDialog from 'components/store/ReviewDialog';
import ReviewDialogOpener from 'components/store/ReviewDialog/ReviewDialogOpener';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        itemTop: {
            zIndex: 10,
        },
        backgroundTop: {
            minHeight: '50vh',
            backgroundImage:
                "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=ivan-torres-MQUqbmszGGM-unsplash.jpg&w=640')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            color: theme.palette.common.white,
        },
        imageBackdrop: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: '50%',
            backgroundColor: theme.palette.common.black,
            opacity: 0.4,
            transition: theme.transitions.create('opacity'),
            zIndex: 5,
        },
        item: {
            padding: theme.spacing(1),
        },
    }),
);

const StorePage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const router = useRouter();
    const { clearCart } = useShoppingCart();
    const { id } = router.query as { id: string };

    const { data } = useSWR<{ dataStore: IStore; dataGroups: IProductGroup[] }>(
        id ? `/api/stores/get?id=${id}` : null,
        fetchGetJSON,
    );
    const { dataStore, dataGroups } = data || {};

    useEffect(() => {
        clearCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout title={dataStore?.title} disablePadding>
            <StoreDialogProvider>
                <Grid container justify="center">
                    <Grid item container justify="center" xs={12} lg={12}>
                        <Grid
                            item
                            container
                            alignItems="center"
                            justify="center"
                            xs={12}
                            lg={12}
                            className={classes.backgroundTop}
                        >
                            <div className={classes.imageBackdrop}></div>
                            <Grid item className={classes.itemTop}>
                                <Typography variant="h2" align="center" component="h1">
                                    {dataStore?.title}
                                </Typography>
                                <Typography variant="h6" align="center" component="p">
                                    <LocationOnIcon />
                                    {dataStore &&
                                        `${dataStore.address.street}, ${
                                            dataStore.address.optional ? '(' + dataStore.address.optional + '), ' : ''
                                        }${dataStore.address.zipcode} ${dataStore.address.city}, ${
                                            dataStore.address.country
                                        }`}
                                </Typography>
                                <Typography align="center" component="div">
                                    <Rating name="half-rating" defaultValue={2.5} precision={0.1} readOnly />
                                </Typography>
                                <Typography variant="button" align="center" component="div">
                                    <ReviewDialogOpener id={id} />
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={9}>
                            {dataGroups
                                ?.sort((a, b) => a.index - b.index)
                                .map((v) => (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    //@ts-ignore
                                    <ProductList key={v.id} group={v} edit={false} />
                                ))}
                        </Grid>
                        <Grid item container xs={12} lg={3}>
                            <Grid item xs={12}>
                                <PayementRecipe
                                    deliveryFee={dataStore?.deliveryFee}
                                    serviceType={dataStore?.serviceType}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <ReviewDialog />
                <ProductDetailDialog />
            </StoreDialogProvider>
        </Layout>
    );
};

export default withAuthUser({
    whenAuthed: AuthAction.RENDER,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
})(StorePage);
