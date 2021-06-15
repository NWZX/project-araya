import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Grid, makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import { DialogDataContext, IProduct, IProductGroup, IStore } from '../../../interfaces';
import firebase from 'firebase';
import { useState } from 'react';
import { Rating } from '@material-ui/lab';
import ProductUpdateDialog from '../../../components/ProductUpdateDialog';
import { useRouter } from 'next/router';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { AuthAction, withAuthUser, useAuthUser, getFirebaseAdmin } from 'next-firebase-auth';
import ProductList from '../../../components/ProductList';
import ProductGroupDelDialog from '../../../components/ProductGroupDelDialog';
import ProductGroupAddDialog from '../../../components/ProductGroupAddDialog';
import ProductAddDialog from '../../../components/ProductAddDialog';
import { GetServerSideProps, NextApiRequest, NextPage } from 'next';
import getAuthUser from '../../../utils/getAuthUser';

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

interface Props {
    store?: IStore;
    productGroups?: IProductGroup[];
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, req }) => {
    try {
        const id: string = query.id as string;
        const db = getFirebaseAdmin().firestore();
        const user = await getAuthUser(req as NextApiRequest);
        if (!user) {
            throw new Error('Need to be authenticated.');
        }

        const accessLevel = (user?.claims.accessLevel as unknown) as number;
        const isAdminOrStoreAdmin = (user?.claims.admin as boolean) || (accessLevel == 2 && id == user.id);
        if (!isAdminOrStoreAdmin) {
            throw new Error('Insufficient permissions.');
        }

        const snapStore = await db.collection('stores').doc(id).get();
        if (!snapStore.exists) {
            throw new Error('No matching event');
        }
        const dataStore = { ...(snapStore.data() as IStore), id: snapStore.id };

        const snapGroups = await db.collection('productGroups').where('storeId', '==', id).get();

        const dataGroups: IProductGroup[] = [];
        snapGroups.forEach((v) => dataGroups.push({ ...(v.data() as IProductGroup), id: v.id }));

        return {
            props: {
                store: dataStore,
                productGroups: dataGroups,
            },
        };
    } catch (error) {
        console.log(error);
        return { props: {} };
    }
};

const StorePage: NextPage = (): JSX.Element | null => {
    const classes = useStyles();
    const router = useRouter();
    const { id } = router.query as { id: string };
    const user = useAuthUser();

    const accessLevel = (user.claims.accessLevel as unknown) as number;
    const isAdminOrStoreAdmin = user.claims.admin || (accessLevel == 2 && id == user.id);

    const [data] = useDocumentData<IStore>(isAdminOrStoreAdmin ? firebase.firestore().doc('stores/' + id) : undefined, {
        idField: 'id',
        refField: 'ref',
    });
    const [groups] = useCollectionData<IProductGroup>(
        isAdminOrStoreAdmin ? firebase.firestore().collection('productGroups').where('storeId', '==', id) : undefined,
        {
            idField: 'id',
            refField: 'ref',
        },
    );

    const selectProduct = useState<IProduct | undefined>();
    const addProduct = useState<IProductGroup | undefined>();
    const updateProduct = useState<IProduct | undefined>();
    const addGroup = useState<boolean>(false);
    const delGroup = useState<IProductGroup | undefined>();

    if (!isAdminOrStoreAdmin) {
        router.push({ pathname: '/stores/[id]', query: { id: id } });
        return null;
    }

    return (
        <Layout title="Restaurant ID" disablePadding>
            <DialogDataContext.Provider
                value={{
                    selectProduct,
                    addProduct,
                    updateProduct,
                    addGroup,
                    delGroup,
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
                    </Grid>
                </Grid>
                <ProductUpdateDialog />
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
