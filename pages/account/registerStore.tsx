import Layout from 'components/Layout';

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
    FormControl,
    FormLabel,
    Button,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import EuroIcon from '@material-ui/icons/Euro';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Inventory from 'icons/Inventory';

import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IAddress, IAddressGeo, IContact, ICustomer, IStore } from 'interfaces';
import validator from 'validator';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';
import { useEffect, useState } from 'react';
import AddressForm from 'components/account/AddressForm';
import ContactForm from 'components/account/ContactForm';
import UploadZone from 'components/account/UploadZone';
import { fetchPostJSON } from 'utils/apiHelpers';

interface IFormInputs {
    firstName: string;
    lastName: string;
    address: IAddress;
    contact: IContact;
    title: string;
    addressStore: IAddressGeo;
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
    title: yup.string().min(2, 'Trop court').max(30, 'Trop long').required('Oups, il manque quelque chose ici.'),
    addressStore: yup.object().shape({
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
    contactStore: yup.object().shape({
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
    minToOrder: yup.number().min(1, 'Trop bas').max(100, 'Trop élévé').required('Oups, il manque quelque chose ici.'),
    deliveryFee: yup.number().min(1, 'Trop bas').max(100, 'Trop élévé').required('Oups, il manque quelque chose ici.'),
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
        mode: 'onSubmit',
    });
    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors },
    } = inputForm;

    const [image, setImage] = useState('');

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

    const onSubmit = async (data: IFormInputs): Promise<void> => {
        //firebase.storage().ref('').
        const store = {
            title: data.title,
            address: data.addressStore,
            contact: data.contactStore,
            minToOrder: data.minToOrder * 100,
            deliveryFee: data.deliveryFee * 100,
            serviceType: data.serviceType,
            imageUrl: image.trim() ? image : undefined,
            private: {
                owner: {
                    firstName: customer?.firstName,
                    lastName: customer?.private.lastName,
                    address: customer?.private.invoiceAddress,
                    contact: customer?.private.contact,
                },
            },
        } as Partial<IStore>;
        const response = await fetchPostJSON<Partial<IStore>, { result: boolean }>('/api/stores/register', store);
        if (response.result) {
            console.log('ok');
        }
    };

    return (
        <Layout title="Ouvrir un magasin" disableHeader>
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            <UploadZone
                                onChange={async (_, blob) => {
                                    setImage(await blob.text());
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputRef={titleRef}
                                {...title}
                                type="text"
                                placeholder="Nom du magasin"
                                variant="outlined"
                                fullWidth
                                required
                                error={Boolean(errors.title)}
                                helperText={errors.title?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider variant="middle" />
                        </Grid>
                        <AddressForm {...inputForm} propName="addressStore" hasMap />
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
                                required
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
                                required
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
                            <FormControl required component="fieldset">
                                <FormLabel component="legend">Mode de livraison disponible</FormLabel>
                                <FormGroup row>
                                    <Controller
                                        control={control}
                                        name="serviceType.isDelivery"
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <FormControlLabel
                                                label="À domicile"
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
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" fullWidth type="submit">
                                Enregistré
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Layout>
    );
};

export default withAuthUser({
    whenAuthed: AuthAction.RENDER,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    authPageURL: '/auth/login',
})(RegisterStorePage);
