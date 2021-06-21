import Layout from 'components/Layout';

import { AuthAction, withAuthUser } from 'next-firebase-auth';

import {
    Grid,
    Theme,
    useTheme,
    BottomNavigation,
    BottomNavigationAction,
    TextField,
    Divider,
    Avatar,
    makeStyles,
    createStyles,
    Button,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Inventory from 'icons/Inventory';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IAddress, IContact, ICustomer } from 'interfaces';
import validator from 'validator';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';
import { useEffect, useState } from 'react';
import AddressForm from 'components/account/AddressForm';
import ContactForm from 'components/account/ContactForm';
import { useSnackbar } from 'notistack';
import { fetchPostJSON } from 'utils/apiHelpers';
import PasswordRequestDialog from 'components/account/PasswordRequestDialog';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            width: theme.spacing(20),
            height: theme.spacing(20),
            margin: 'auto',
        },
    }),
);

interface IFormInputs {
    firstName: string;
    lastName: string;
    address: IAddress;
    contact: IContact;
}

// const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/\\~_+\-=|]).{8,32}$/i;
const schema = yup.object().shape({
    firstName: yup.string().min(2, 'Trop court').max(30, 'Trop long').required('Oups, il manque quelque chose ici.'),
    lastName: yup.string().min(2, 'Trop court').max(30, 'Trop long').required('Oups, il manque quelque chose ici.'),
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
    contact: yup.object().shape({
        email: yup
            .string()
            .email('Hmm..., ça ne resemble pas à une email.')
            .required('Oups, il manque quelque chose ici.'),
        phone: yup
            .string()
            .test('isPhoneNumber', 'Hmm..., ça ne resemble pas à un numéro de téléphone.', (v) => {
                if (v?.length == 0) return true;
                return validator.isMobilePhone(v || '', 'any');
            })
            .required('Oups, il manque quelque chose ici.'),
    }),
});

const ProfilePage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const user = useAuthUser();
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    router.prefetch('/account');

    const [customer] = useDocumentData<ICustomer>(
        user.id ? firebase.firestore().doc('customers/' + user.id) : undefined,
        {
            idField: 'id',
            refField: 'ref',
        },
    );

    const inputForm = useForm<IFormInputs>({
        resolver: yupResolver(schema),
        mode: 'onTouched',
    });
    const {
        register,
        reset,
        trigger,
        getValues,
        formState: { errors },
    } = inputForm;

    const handleNames = async (): Promise<void> => {
        try {
            const isValid = await trigger(['firstName', 'lastName']);
            if (isValid) {
                await customer?.ref?.set(
                    {
                        firstName: getValues('firstName'),
                        private: { lastName: getValues('lastName') },
                    } as Partial<ICustomer>,
                    { merge: true },
                );
            }
            enqueueSnackbar('Modifier', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };
    const handleAddress = async (): Promise<void> => {
        try {
            const isValid = await trigger('address');
            if (isValid) {
                await customer?.ref?.set(
                    {
                        private: { invoiceAddress: getValues('address') },
                    } as Partial<ICustomer>,
                    { merge: true },
                );
            }
            enqueueSnackbar('Modifier', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };
    const handleContact = async (): Promise<void> => {
        try {
            const isValid = await trigger('contact');
            if (isValid) {
                await customer?.ref?.set(
                    {
                        private: { contact: { phone: getValues('contact.phone') } },
                    } as Partial<ICustomer>,
                    { merge: true },
                );
                if (user.email != getValues('contact.email')) {
                    const result = await fetchPostJSON<{ newEmail: string }, { result: boolean; url: string }>(
                        '/api/account/getEmailToken',
                        { newEmail: getValues('contact.email') },
                    );
                    if (!result?.result) {
                        throw new Error('Missing token');
                    }
                    await user.firebaseUser?.verifyBeforeUpdateEmail(getValues('contact.email'), { url: result.url });
                    enqueueSnackbar('Un email de validation vous a été envoyer.', { variant: 'info' });
                } else {
                    enqueueSnackbar('Modifier', { variant: 'success' });
                }
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    useEffect(() => {
        if (customer) {
            reset({
                firstName: customer.firstName,
                lastName: customer.private.lastName,
                address: customer.private.invoiceAddress,
                contact: customer.private.contact,
            });
        }
    }, [customer, reset]);

    const { ref: lastNameRef, ...lastName } = register('lastName');
    const { ref: firstNameRef, ...firstName } = register('firstName');

    return (
        <Layout title="Dashboard" disableHeader>
            <BottomNavigation value={2} showLabels>
                <BottomNavigationAction
                    label="Retour"
                    icon={<HomeIcon />}
                    onClick={() => {
                        router.push('/');
                    }}
                />
                <BottomNavigationAction
                    label="Commandes"
                    icon={<Inventory />}
                    onClick={() => {
                        router.push('/account');
                    }}
                />
                <BottomNavigationAction label="Mon Profil" icon={<AccountCircleIcon />} />
            </BottomNavigation>
            <Grid container spacing={3} justify="center" style={{ padding: theme.spacing(3) }}>
                <Grid item container spacing={3} lg={9} sm={12} xl={10} xs={12}>
                    <Grid item xs={12}>
                        <Avatar className={classes.avatar} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TextField
                            inputRef={lastNameRef}
                            {...lastName}
                            type="text"
                            placeholder="Nom"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.lastName)}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TextField
                            inputRef={firstNameRef}
                            {...firstName}
                            type="text"
                            placeholder="Prénom"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.firstName)}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth onClick={handleNames}>
                            Mettre à jour
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <AddressForm {...inputForm} propName="address" />
                    <Grid item xs={12}>
                        <Button fullWidth onClick={handleAddress}>
                            Mettre à jour
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <ContactForm {...inputForm} propName="contact" />
                    <Grid item xs={12}>
                        <Button fullWidth onClick={() => setOpen(true)}>
                            Mettre à jour
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <PasswordRequestDialog
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                onSuccess={() => {
                    handleContact();
                    setOpen(false);
                }}
            />
        </Layout>
    );
};

export default withAuthUser({
    whenAuthed: AuthAction.RENDER,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    authPageURL: '/auth/login',
})(ProfilePage);
