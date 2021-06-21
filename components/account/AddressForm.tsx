import { Grid, TextField } from '@material-ui/core';
import { lookup } from 'country-data';
import firebase from 'firebase';
import dynamic from 'next/dynamic';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { INominatimReverseResult } from 'interfaces';
import { fetchGetJSON } from 'utils/apiHelpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends UseFormReturn<any> {
    propName: string;
    hasMap?: boolean;
    disabled?: boolean;
}

const newGeoPoint = (latitude: number, longitude: number): firebase.firestore.GeoPoint => {
    return new firebase.firestore.GeoPoint(latitude || 14.643418, longitude || -61.010866);
};

const AddressForm = ({
    register,
    formState: { errors },
    setValue,
    getValues,
    propName,
    hasMap,
    disabled,
}: Props): JSX.Element => {
    const { ref: streetRef, ...street } = register(`${propName}.street`);
    const { ref: zipcodeRef, ...zipcode } = register(`${propName}.zipcode`);
    const { ref: cityRef, ...city } = register(`${propName}.city`);
    const { ref: countryRef, ...country } = register(`${propName}.country`);

    const MapWithNoSSR = dynamic(() => import('../Map'), {
        ssr: false,
    });

    const updateLocation = async (latitude: number, longitude: number): Promise<void> => {
        const result = await fetchGetJSON<INominatimReverseResult>(
            `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${latitude}&lon=${longitude}`,
        );
        console.log('REQ');
        const address = result.features[0].properties.address;
        const country = lookup.countries({ name: address.state })[0];
        setValue(`${propName}.street`, address.road, { shouldDirty: true, shouldValidate: true });
        setValue(`${propName}.zipcode`, address.postcode, { shouldDirty: true, shouldValidate: true });
        setValue(`${propName}.city`, address.city || address.town || address.village, {
            shouldDirty: true,
            shouldValidate: true,
        });
        setValue(`${propName}.country`, country.alpha2, { shouldDirty: true, shouldValidate: true });
    };

    const currentLocation = newGeoPoint(
        getValues(`${propName}.geolocation.latitude`),
        getValues(`${propName}.geolocation.longitude`),
    );

    return (
        <>
            {hasMap && (
                <Grid item xs={12}>
                    <MapWithNoSSR
                        heigth={400}
                        positionCenter={currentLocation}
                        positionMarker={[
                            {
                                marker: currentLocation,
                                title: 'Mon magasin',
                            },
                        ]}
                        zoom={13}
                        scrollZoom
                        draggableMarker
                        onDrag={(l) => {
                            setValue(`${propName}.geolocation.latitude`, l.latitude);
                            setValue(`${propName}.geolocation.longitude`, l.longitude);
                            updateLocation(l.latitude, l.longitude);
                        }}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <TextField
                    inputRef={streetRef}
                    {...street}
                    type="text"
                    placeholder="Rue"
                    variant="outlined"
                    fullWidth
                    disabled={disabled}
                    error={Boolean(errors[propName]?.street)}
                    helperText={errors[propName]?.street?.message}
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
                    disabled={disabled}
                    error={Boolean(errors[propName]?.zipcode)}
                    helperText={errors[propName]?.zipcode?.message}
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
                    disabled={disabled}
                    error={Boolean(errors[propName]?.city)}
                    helperText={errors[propName]?.city?.message}
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
                    disabled={disabled}
                    error={Boolean(errors[propName]?.country)}
                    helperText={errors[propName]?.country?.message}
                />
            </Grid>
        </>
    );
};

export default AddressForm;
