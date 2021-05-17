import { Grid, TextField } from '@material-ui/core';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends UseFormReturn<any> {
    disabled?: boolean;
}

const IdentityForm = ({ register, formState: { errors }, disabled }: Props): JSX.Element => {
    const { ref: lastNameRef, ...lastName } = register(`lastName`);
    const { ref: firstNameRef, ...firstName } = register(`firstName`);

    return (
        <>
            <Grid item xs={12}>
                <TextField
                    inputRef={lastNameRef}
                    {...lastName}
                    type="text"
                    placeholder="Nom"
                    variant="outlined"
                    fullWidth
                    disabled={disabled}
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName?.message}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    inputRef={firstNameRef}
                    {...firstName}
                    type="text"
                    placeholder="Prénom"
                    variant="outlined"
                    fullWidth
                    disabled={disabled}
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName?.message}
                />
            </Grid>
        </>
    );
};

export default IdentityForm;
