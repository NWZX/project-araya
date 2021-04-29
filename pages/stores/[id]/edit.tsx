import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Grid, makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import { DialogDataContext, IProduct, IProductGroup, IStore } from '../../../interfaces';
import firebase from 'firebase';
import { useState } from 'react';
import { Rating } from '@material-ui/lab';
import PayementRecipe from '../../../components/PayementRecipe';
import ProductDetailDialog from '../../../components/ProductDetailDialog';
import { useRouter } from 'next/router';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { AuthAction, withAuthUser } from 'next-firebase-auth';
import ProductList from '../../../components/ProductList';
import ProductGroupDelDialog from '../../../components/ProductGroupDelDialog';
import ProductGroupAddDialog from '../../../components/ProductGroupAddDialog';
import ProductAddDialog from '../../../components/ProductAddDialog';
import { NextPage } from 'next';

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
    const { id } = router.query as { id: string };

    const [data] = useDocumentData<IStore>(firebase.firestore().doc('stores/' + id), {
        idField: 'id',
        refField: 'ref',
    });
    const [groups] = useCollectionData<IProductGroup>(
        firebase.firestore().collection('productGroups').where('storeId', '==', id),
        {
            idField: 'id',
            refField: 'ref',
        },
    );

    return (
        <Layout title="Restaurant ID" disablePadding>
            <DialogDataContext.Provider
                value={{
                    selectProduct: useState<IProduct | undefined>(),
                    addProduct: useState<IProductGroup | undefined>(),
                    updateProduct: useState<IProduct | undefined>(),
                    addGroup: useState<boolean>(false),
                    delGroup: useState<IProductGroup | undefined>(),
                }}
            >
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
                                    {data?.title}
                                </Typography>
                                <Typography variant="h6" align="center" component="p">
                                    <LocationOnIcon />
                                    {data &&
                                        `${data.address.street}, ${
                                            data.address.optional ? '(' + data.address.optional + '), ' : ''
                                        }${data.address.zipcode} ${data?.address.city}, ${data.address.country}`}
                                </Typography>
                                <Typography align="center" component="div">
                                    <Rating name="half-rating" defaultValue={2.5} precision={0.1} readOnly />
                                </Typography>
                                <Typography variant="button" align="center" component="div">
                                    (
                                    <Link href="#">
                                        <a>Voir les avis</a>
                                    </Link>
                                    )
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={9}>
                            {groups
                                ?.sort((a, b) => a.index - b.index)
                                .map((v) => (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    //@ts-ignore
                                    <ProductList key={v.id} group={v} edit={true} />
                                ))}
                        </Grid>
                        <Grid item container xs={12} lg={3}>
                            <Grid item xs={12}>
                                <PayementRecipe />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <ProductDetailDialog />
                <ProductGroupDelDialog />
                <ProductGroupAddDialog />
                <ProductAddDialog />
            </DialogDataContext.Provider>
        </Layout>
    );
};

export default withAuthUser({
    whenAuthed: AuthAction.RENDER,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
})(StorePage);
