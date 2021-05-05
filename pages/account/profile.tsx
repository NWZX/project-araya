import Layout from '../../components/Layout';

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
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Inventory from '../../components/Icons/Inventory';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IAddress, ICustomer } from '../../interfaces';
import validator from 'validator';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';
import { useEffect } from 'react';

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
});

const ProfilePage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const user = useAuthUser();
    const router = useRouter();
    router.prefetch('/account');

    const [customer] = useDocumentData<ICustomer>(
        user.id ? firebase.firestore().doc('customers/' + user.id) : undefined,
        {
            idField: 'id',
            refField: 'ref',
        },
    );

    const {
        register,
        reset,
        formState: { errors },
    } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
        mode: 'onTouched',
    });

    useEffect(() => {
        if (customer) {
            reset({
                firstName: customer.firstName,
                lastName: customer.private.lastName,
                address: customer.private.invoiceAddress,
            });
        }
    }, [customer, reset]);

    const { ref: lastNameRef, ...lastName } = register('lastName');
    const { ref: firstNameRef, ...firstName } = register('firstName');
    const { ref: streetRef, ...street } = register('address.street');
    const { ref: zipcodeRef, ...zipcode } = register('address.zipcode');
    const { ref: cityRef, ...city } = register('address.city');
    const { ref: countryRef, ...country } = register('address.country');

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
                        <Divider variant="middle" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            inputRef={streetRef}
                            {...street}
                            type="text"
                            placeholder="Rue"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.address?.street)}
                            helperText={errors.address?.street?.message}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <TextField
                            inputRef={zipcodeRef}
                            {...zipcode}
                            type="text"
                            placeholder="Code Postal"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.address?.zipcode)}
                            helperText={errors.address?.zipcode?.message}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TextField
                            inputRef={cityRef}
                            {...city}
                            type="text"
                            placeholder="Ville"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.address?.city)}
                            helperText={errors.address?.city?.message}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <TextField
                            inputRef={countryRef}
                            {...country}
                            type="text"
                            placeholder="Pays"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.address?.country)}
                            helperText={errors.address?.country?.message}
                        />
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
})(ProfilePage);
