import Layout from '../../components/Layout';

import { AuthAction, withAuthUser } from 'next-firebase-auth';

import { Grid, useTheme, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import { useAuthUser } from 'next-firebase-auth';
import Budget from '../../components/account/Budget';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import TotalOrders from '../../components/account/TotalOrders';
import ListOrders from '../../components/account/ListOrders';
import TotalProducts from '../../components/account/TotalProducts';
import Inventory from '../../components/Icons/Inventory';

const AccountPage: NextPage = (): JSX.Element => {
    const router = useRouter();
    const theme = useTheme();
    const user = useAuthUser();

    return (
        <Layout title="Dashboard" disableHeader>
            <BottomNavigation value={1} showLabels>
                <BottomNavigationAction
                    label="Retour"
                    icon={<HomeIcon />}
                    onClick={() => {
                        router.push('/');
                    }}
                />
                <BottomNavigationAction label="Commandes" icon={<Inventory />} />
                <BottomNavigationAction label="Mon Profil" icon={<AccountCircleIcon />} />
            </BottomNavigation>
            <Grid container spacing={3} style={{ padding: theme.spacing(3) }}>
                {user.claims.admin ||
                    (((user.claims.accessLevel as unknown) as number) == 2 && (
                        <>
                            <Grid item lg={3} sm={6} xl={3} xs={12}>
                                <Budget />
                            </Grid>
                            <Grid item lg={3} sm={6} xl={3} xs={12}>
                                <TotalProducts />
                            </Grid>
                        </>
                    ))}
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
