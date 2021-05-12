import Layout from '../../components/Layout';

import { AuthAction, withAuthUser } from 'next-firebase-auth';

import {
    Grid,
    useTheme,
    BottomNavigation,
    BottomNavigationAction,
    TextField,
    Divider,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    InputAdornment,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import EuroIcon from '@material-ui/icons/Euro';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Inventory from '../../components/Icons/Inventory';

import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IAddress, IContact, ICustomer } from '../../interfaces';
import validator from 'validator';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';
import { useEffect } from 'react';
import AddressForm from '../../components/account/AddressForm';
import ContactForm from '../../components/account/ContactForm';
import UploadZone from '../../components/account/UploadZone';

interface IFormInputs {
    firstName: string;
    lastName: string;
    address: IAddress;
    contact: IContact;
    title: string;
    addressStore: IAddress;
    contactStore: IContact;
    minToOrder: number;
    deliveryFee: number;
    serviceType: {
        isTakeAway?: boolean;
        isOnSpot?: boolean;
        isDelivery?: boolean;
    };
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

const RegisterStorePage: NextPage = (): JSX.Element => {
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

    const inputForm = useForm<IFormInputs>({
        resolver: yupResolver(schema),
        mode: 'onTouched',
    });
    const {
        register,
        control,
        reset,
        formState: { errors },
    } = inputForm;

    useEffect(() => {
        if (customer) {
            reset({
                firstName: customer.firstName,
                lastName: customer.private.lastName,
                address: customer.private.invoiceAddress,
                contact: customer.private.contact,
                minToOrder: 10,
                deliveryFee: 10,
            });
        }
    }, [customer, reset]);

    //
    const { ref: lastNameRef, ...lastName } = register('lastName');
    const { ref: firstNameRef, ...firstName } = register('firstName');
    //
    const { ref: titleRef, ...title } = register('title');
    //
    const { ref: minOrderRef, ...minOrder } = register('minToOrder');
    const { ref: deliveryFeeRef, ...deliveryFee } = register('deliveryFee');

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
                        <Typography variant="h3" align="center">
                            Propriétaire
                        </Typography>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TextField
                            inputRef={lastNameRef}
                            {...lastName}
                            type="text"
                            placeholder="Nom"
                            variant="outlined"
                            fullWidth
                            disabled
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
                            disabled
                            error={Boolean(errors.firstName)}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <AddressForm {...inputForm} propName="address" disabled />
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <ContactForm {...inputForm} propName="contact" disabled />
                </Grid>
                <Grid item container spacing={3} lg={9} sm={12} xl={10} xs={12}>
                    <Grid item xs={12}>
                        <Typography variant="h3" align="center">
                            Magasin
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <UploadZone />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            inputRef={titleRef}
                            {...title}
                            type="text"
                            placeholder="Nom du magasin"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.title)}
                            helperText={errors.title?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <AddressForm {...inputForm} propName="addressStore" />
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <ContactForm {...inputForm} propName="contactStore" />
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TextField
                            inputRef={minOrderRef}
                            {...minOrder}
                            type="number"
                            placeholder="Montant minimum pour la livraison"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.minToOrder)}
                            helperText={errors.minToOrder?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <EuroIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TextField
                            inputRef={deliveryFeeRef}
                            {...deliveryFee}
                            type="number"
                            placeholder="Frais de livraison"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.deliveryFee)}
                            helperText={errors.deliveryFee?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <EuroIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup row>
                            <Controller
                                control={control}
                                name="serviceType.isDelivery"
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <FormControlLabel
                                        label="Livraison"
                                        control={
                                            <Checkbox
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                checked={value}
                                                inputRef={ref}
                                            />
                                        }
                                    ></FormControlLabel>
                                )}
                            />
                            <Controller
                                control={control}
                                name="serviceType.isTakeAway"
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <FormControlLabel
                                        label="Pick & Collect"
                                        control={
                                            <Checkbox
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                checked={value}
                                                inputRef={ref}
                                            />
                                        }
                                    ></FormControlLabel>
                                )}
                            />
                            <Controller
                                control={control}
                                name="serviceType.isOnSpot"
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <FormControlLabel
                                        label="Sur Place"
                                        control={
                                            <Checkbox
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                checked={value}
                                                inputRef={ref}
                                                disabled
                                            />
                                        }
                                    ></FormControlLabel>
                                )}
                            />
                        </FormGroup>
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
})(RegisterStorePage);
