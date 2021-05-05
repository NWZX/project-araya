import Layout from '../../components/Layout';
import {
    Grid,
    makeStyles,
    createStyles,
    Theme,
    useMediaQuery,
    useTheme,
    Typography,
    Link,
    Button,
} from '@material-ui/core';
import { AuthAction, withAuthUser, useAuthUser } from 'next-firebase-auth';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        cover: {
            minHeight: '100vh',
            backgroundImage:
                "url('https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=masimo-grabar-NzHRSLhc6Cs-unsplash.jpg&w=640')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        },
        a: {
            textDecoration: 'none',
            color: theme.palette.secondary.main,
            '&:visited': {
                color: theme.palette.secondary.main,
            },
        },
    }),
);

const EmailValidatePage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const user = useAuthUser();

    if (user.firebaseUser && user.emailVerified) {
        router.push('/account');
    }

    return (
        <Layout title="Account validation" disableHeader>
            <Grid container alignItems="center" justify="center">
                <Grid item container xs={12} alignItems="center" justify="center">
                    <Grid item xs={false} lg={6} className={classes.cover}></Grid>
                    <Grid item container xs={12} lg={6} style={{ padding: '5%' }}>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <Typography variant={isMobile ? 'h3' : 'h2'} align="left">
                                Confirmation de votre email
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <Typography variant="button" component="p" align="left">
                                Un email à été envoyer dans votre boite mail.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <Link href="/">
                                <Button variant="outlined" fullWidth>
                                    Retourner à la page d&apos;accueil
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
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
})(EmailValidatePage);
