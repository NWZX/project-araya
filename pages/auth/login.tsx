import Link from 'next/link';
import Layout from '../../components/Layout';
import {
    Grid,
    TextField,
    Typography,
    makeStyles,
    createStyles,
    Theme,
    useMediaQuery,
    useTheme,
    Button,
    Divider,
} from '@material-ui/core';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import firebase from 'firebase/app';
import { AuthAction, withAuthUser } from 'next-firebase-auth';
import { NextPage } from 'next';

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

interface IFormInputs {
    email: string;
    password: string;
}
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/\\~_+\-=|]).{8,32}$/i;
const schema = yup.object().shape({
    email: yup.string().email('Seem not to be an email.').required('Oups, somethings is missing here.'),
    password: yup
        .string()
        .matches(passwordRegex, 'Hmmm, it seem too easy.')
        .required('Oups, somethings is missing here.'),
});

const LoginPage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { enqueueSnackbar } = useSnackbar();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInputs>({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        resolver: yupResolver(schema),
    });
    const { ref: emailRef, ...email } = register('email');
    const { ref: passwordRef, ...password } = register('password');
    const onSubmit = async (data: IFormInputs): Promise<void> => {
        try {
            if (!(await firebase.auth().signInWithEmailAndPassword(data.email, data.password)).user?.emailVerified) {
                enqueueSnackbar('Check your email to activite this account.', { variant: 'error' });
                firebase.auth().signOut();
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };
    return (
        <Layout title="Connexion" disableHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container alignItems="center" justify="center">
                    <Grid item container xs={12} alignItems="center" justify="center">
                        <Grid item xs={false} lg={6} className={classes.cover}></Grid>
                        <Grid item container xs={12} lg={6} style={{ padding: '5%' }}>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant="h2" align="center">
                                    <a href="/">
                                        <img src="/icons/ms-icon-310x310.png" alt="Logo Araya" width={192} />
                                    </a>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant={isMobile ? 'h3' : 'h2'} align="justify">
                                    Connexion
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant="button" component="p" align="justify">
                                    Ridiculus sociosqu cursus neque cursus curae ante scelerisque vehicula.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <TextField
                                    inputRef={emailRef}
                                    {...email}
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Email"
                                    variant="outlined"
                                    fullWidth
                                    error={Boolean(errors.email)}
                                    helperText={errors.email?.message}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <TextField
                                    inputRef={passwordRef}
                                    {...password}
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    variant="outlined"
                                    fullWidth
                                    error={Boolean(errors.password)}
                                    helperText={errors.password?.message}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Button type="submit" variant="outlined" fullWidth>
                                    Connexion
                                </Button>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Divider variant="middle" />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant="button" component="p" align="center">
                                    <Link href="/auth/register">
                                        <a className={classes.a}>Oublier votre mot de passe ?</a>
                                    </Link>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant="button" component="p" align="center">
                                    Pour crée un compte,
                                    <Link href="/auth/register">
                                        <a className={classes.a}>cliquer ici</a>
                                    </Link>
                                    .
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Layout>
    );
};

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
    appPageURL: '/',
})(LoginPage);
