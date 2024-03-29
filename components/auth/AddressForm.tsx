import { Grid, TextField } from '@material-ui/core';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends UseFormReturn<any> {
    propName: string;
    disabled?: boolean;
}

const AddressForm = ({ register, formState: { errors }, propName, disabled }: Props): JSX.Element => {
    const { ref: streetRef, ...street } = register(`${propName}.street`);
    const { ref: zipcodeRef, ...zipcode } = register(`${propName}.zipcode`);
    const { ref: cityRef, ...city } = register(`${propName}.city`);
    const { ref: countryRef, ...country } = register(`${propName}.country`);

    return (
        <>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
