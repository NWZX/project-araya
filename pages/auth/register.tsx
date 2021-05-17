import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import {
    Grid,
    Typography,
    makeStyles,
    createStyles,
    Theme,
    useMediaQuery,
    useTheme,
    Button,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import firebase from 'firebase/app';
import { AuthAction, withAuthUser } from 'next-firebase-auth';
import { fetchPostJSON } from '../../utils/apiHelpers';
import { IAddress, ICustomer } from '../../interfaces';
import validator from 'validator';
import { ChangeEvent, useState } from 'react';
import { NextPage } from 'next';
import AddressForm from '../../components/auth/AddressForm';
import AccountForm from '../../components/auth/AccountForm';
import IdentityForm from '../../components/auth/IndentityForm';

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
    firstName: string;
    lastName: string;
    phone: string;
    address: IAddress;
}
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/\\~_+\-=|]).{8,32}$/i;
const schema = yup.object().shape({
    email: yup.string().email('Hmm..., ça ne resemble pas à une email.').required('Oups, il manque quelque chose ici.'),
    password: yup
        .string()
        .matches(passwordRegex, 'Hmm..., un peu trop simple.')
        .required('Oups, il manque quelque chose ici.'),
    firstName: yup.string().min(2, 'Trop court').max(30, 'Trop long').required('Oups, il manque quelque chose ici.'),
    lastName: yup.string().min(2, 'Trop court').max(30, 'Trop long').required('Oups, il manque quelque chose ici.'),
    phone: yup
        .string()
        .test('isPhoneNumber', 'Hmm..., ça ne resemble pas à un numéro de téléphone.', (v) => {
            if (v?.length == 0) return true;
            return validator.isMobilePhone(v || '', 'any');
        })
        .required('Oups, il manque quelque chose ici.'),
    address: yup.object().shape({
        street: yup.string().min(2, 'Trop court').max(100, 'Trop long.').required('Oups, il manque quelque chose ici.'),
        optional: yup.string().min(2, 'Trop court').max(100, 'Trop long.'),
        zipcode: yup
            .string()
            .test('isZipCode', 'Hmm..., ça ne resemble pas à un code postale.', (v) => {
                if (v?.length == 0) return true;
                return validator.isPostalCode(v || '', 'FR');
            })
            .required('Oups, il manque quelque chose ici.'),
        city: yup.string().min(2, 'Trop court').max(50, 'Trop long.').required('Oups, il manque quelque chose ici.'),
        country: yup.string().min(2).max(2).required('Oups, il manque quelque chose ici.'),
    }),
});

const RegisterPage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [expanded, setExpanded] = useState<string | false>('panel1');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (panel: string) => (_event: ChangeEvent<any>, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const inputForm = useForm<IFormInputs>({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        resolver: yupResolver(schema),
        mode: 'onTouched',
    });
    const {
        handleSubmit,
        formState: { isValid, isSubmitting },
    } = inputForm;
    const onSubmit = async (data: IFormInputs): Promise<void> => {
        try {
            const result = await fetchPostJSON<
                { customer: ICustomer; password: string },
                { result: boolean; token: string; url: string }
            >('/api/auth/register', {
                customer: {
                    firstName: data.firstName,
                    private: {
                        lastName: data.lastName,
                        contact: {
                            email: data.email,
                            phone: data.phone,
                        },
                        invoiceAddress: data.address,
                    },
                    createdAt: firebase.firestore.Timestamp.now(),
                },
                password: data.password,
            });
            if (result.result) {
                const sign = await firebase.auth().signInWithCustomToken(result.token);
                await sign.user?.sendEmailVerification({ url: result.url });
                router.push('/auth/emailValidate');
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    return (
        <Layout title="Inscription" disableHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container alignItems="center" justify="center">
                    <Grid item container xs={12} alignItems="center" justify="center">
                        <Grid item xs={false} lg={6} className={classes.cover}></Grid>
                        <Grid item container xs={12} lg={6} style={{ paddingLeft: '5%', paddingRight: '5%' }}>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant="h2" align="center">
                                    <a href="/">
                                        <img src="/icons/ms-icon-310x310.png" alt="Logo Araya" width={192} />
                                    </a>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant={isMobile ? 'h3' : 'h2'} align="justify">
                                    Inscription
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant="button" component="p" align="justify">
                                    Ridiculus sociosqu cursus neque cursus curae ante scelerisque vehicula.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                        <Typography>Identifiant</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={1}>
                                            <AccountForm {...inputForm} />
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                    <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                        <Typography>Information Personnel</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={1}>
                                            <IdentityForm {...inputForm} />
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                        <Typography>Adresse de facturation</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={1}>
                                            <AddressForm {...inputForm} propName="address" />
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Button type="submit" variant="outlined" fullWidth disabled={!isValid || isSubmitting}>
                                    Valider
                                </Button>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant="button" component="p" align="justify">
                                    En vous inscrivant, vous acceptez nos{' '}
                                    <Link href="/tos">
                                        <a className={classes.a}>conditions d&apos;utilisation</a>
                                    </Link>
                                    .
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Divider variant="middle" />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant="button" component="p" align="center">
                                    Déjà un compte,{' '}
                                    <Link href="/auth/login">
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
})(RegisterPage);
