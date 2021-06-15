import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { AuthAction, withAuthUser } from 'next-firebase-auth';
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
    Stepper,
    Step,
    StepLabel,
    Hidden,
    IconButton,
} from '@material-ui/core';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import { useState } from 'react';
import firebase from 'firebase';
import { fetchGetJSON, fetchPostJSON } from '../../utils/apiHelpers';
import { EServiceType, IAddress, IAddressGeo, INominatimReverseResult } from '../../interfaces';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { lookup } from 'country-data';
import validator from 'validator';
import { CartDetails, useShoppingCart } from 'use-shopping-cart';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        cover: {
            minHeight: '100vh',
        },
        map: {
            backgroundColor: theme.palette.background.paper,
            zIndex: 1100,
            margin: '1rem',
        },
    }),
);

interface IFormInputs {
    detail: string;
    address: IAddress;
}
const schema = yup.object().shape({
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

const AddressStepPage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const steps = ['Detail de la commande', 'Payement', 'Validé'];
    const [location, setLocation] = useState<firebase.firestore.GeoPoint | undefined>();

    const { cartDetails, redirectToCheckout } = useShoppingCart();

    const router = useRouter();
    const { id } = router.query as { id: string };
    const { enqueueSnackbar } = useSnackbar();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IFormInputs>({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        resolver: yupResolver(schema),
        mode: 'onTouched',
    });

    const MapWithNoSSR = dynamic(() => import('../../components/Map'), {
        ssr: false,
    });
    const updateLocation = (): void => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                setLocation(new firebase.firestore.GeoPoint(pos.coords.latitude, pos.coords.longitude));
                const result = await fetchGetJSON<INominatimReverseResult>(
                    `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
                );
                const address = result.features[0].properties.address;
                const country = lookup.countries({ name: address.state })[0];
                setValue('address.street', address.road, { shouldDirty: true, shouldValidate: true });
                setValue('address.zipcode', address.postcode, { shouldDirty: true, shouldValidate: true });
                setValue('address.city', address.town, { shouldDirty: true, shouldValidate: true });
                setValue('address.country', country.alpha2, { shouldDirty: true, shouldValidate: true });
            },
            (err) => {
                enqueueSnackbar(err.message, { variant: 'error' });
            },
            { enableHighAccuracy: true },
        );
    };
    const onSubmit = async (data: IFormInputs): Promise<void> => {
        try {
            if (location) {
                const response = await fetchPostJSON<
                    {
                        storeId: string;
                        cart: CartDetails;
                        delivery: number;
                        address?: IAddressGeo;
                        detail?: string;
                    },
                    { id: string }
                >('/api/checkout/cart', {
                    storeId: id,
                    cart: cartDetails,
                    delivery: EServiceType.Delivery,
                    address: { ...data.address, geolocation: location },
                    detail: data.detail,
                });
                redirectToCheckout({ sessionId: response.id });
                enqueueSnackbar('Commande Enregister', { variant: 'success' });
            } else {
                enqueueSnackbar('Nous avons besoin de votre locatisation pour continuer.', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const { ref: streetRef, ...street } = register('address.street');
    const { ref: zipcodeRef, ...zipcode } = register('address.zipcode');
    const { ref: cityRef, ...city } = register('address.city');
    const { ref: countryRef, ...country } = register('address.country');

    return (
        <Layout title="Detail de la commande" disableHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container alignItems="center" justify="center">
                    <Grid item container xs={12} alignItems="center" justify="center">
                        <Hidden mdDown>
                            <Grid item lg={6} className={classes.cover}>
                                <MapWithNoSSR
                                    heigth={'100vh'}
                                    positionCenter={location}
                                    positionMarker={[
                                        {
                                            marker: location || new firebase.firestore.GeoPoint(0, 0),
                                            title: 'Ma position',
                                        },
                                    ]}
                                    zoom={13}
                                    scrollZoom
                                    rightZone={
                                        <IconButton
                                            className={classes.map}
                                            onClick={() => {
                                                updateLocation();
                                            }}
                                        >
                                            {location ? <MyLocationIcon /> : <LocationSearchingIcon />}
                                        </IconButton>
                                    }
                                />
                            </Grid>
                        </Hidden>
                        <Grid item container xs={12} lg={6} style={{ padding: '5%' }}>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Stepper activeStep={0} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant={isMobile ? 'h3' : 'h2'} align="justify">
                                    Detail de commande
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Typography variant="button" component="p" align="justify">
                                    Ridiculus sociosqu cursus neque cursus curae ante scelerisque vehicula.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <TextField
                                    {...street}
                                    inputRef={streetRef}
                                    type="text"
                                    placeholder="Rue (Requise)"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={Boolean(errors.address?.street)}
                                    helperText={errors.address?.street?.message}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <TextField
                                    {...zipcode}
                                    inputRef={zipcodeRef}
                                    type="text"
                                    placeholder="Code Postal (Requis)"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={Boolean(errors.address?.zipcode)}
                                    helperText={errors.address?.zipcode?.message}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <TextField
                                    {...city}
                                    inputRef={cityRef}
                                    type="text"
                                    placeholder="Ville (Requise)"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={Boolean(errors.address?.city)}
                                    helperText={errors.address?.city?.message}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <TextField
                                    {...country}
                                    inputRef={countryRef}
                                    type="text"
                                    placeholder="Pays (Requis)"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={Boolean(errors.address?.country)}
                                    helperText={errors.address?.country?.message}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Divider variant="middle" />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <TextField
                                    {...register('detail')}
                                    type="text"
                                    multiline
                                    rows={3}
                                    placeholder="Details supplémentaires concernant la commande : Allergie, demande spéciale…"
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} style={{ margin: '0.5rem' }}>
                                <Button type="submit" variant="outlined" fullWidth>
                                    Payement
                                </Button>
                            </Grid>
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
    authPageURL: '/auth/login?redirect=/order/start',
})(AddressStepPage);
