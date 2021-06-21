import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AuthAction, withAuthUser } from 'next-firebase-auth';
import { useAuthUser } from 'next-firebase-auth';

import { Grid, useTheme } from '@material-ui/core';

import Layout from 'components/Layout';
import Budget from 'components/account/Budget';
import TotalOrders from 'components/account/TotalOrders';
import ListOrders from 'components/account/ListOrders';
import TotalProducts from 'components/account/TotalProducts';
import TopTab from 'components/account/TopTab';

const AccountPage: NextPage = (): JSX.Element => {
    const router = useRouter();
    const theme = useTheme();
    const user = useAuthUser();
    const accessLevel = (user.claims.accessLevel as unknown) as number;
    const isAdminOrStoreAdmin = user.claims.admin || (accessLevel == 2 && router.query.id == user.id);

    return (
        <Layout title="Tableau de bord" disableHeader>
            <TopTab selected={1} />
            <Grid container spacing={3} style={{ padding: theme.spacing(3) }}>
                {isAdminOrStoreAdmin && (
                    <>
                        <Grid item lg={3} sm={6} xl={3} xs={12}>
                            <Budget />
                        </Grid>
                        <Grid item lg={3} sm={6} xl={3} xs={12}>
                            <TotalProducts />
                        </Grid>
                    </>
                )}
                <Grid item lg={3} sm={6} xl={3} xs={12}>
                    <TotalOrders />
                </Grid>

                <Grid item xs={12}>
                    <ListOrders />
                </Grid>
            </Grid>
        </Layout>
    );
};

export default withAuthUser({
    whenAuthed: AuthAction.RENDER,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    authPageURL: '/auth/login',
})(AccountPage);
