import { Grid, TextField } from '@material-ui/core';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends UseFormReturn<any> {
    propName: string;
    disabled?: boolean;
}

const ContactForm = ({ register, formState: { errors }, propName, disabled }: Props): JSX.Element => {
    const { ref: phoneRef, ...phone } = register(`${propName}.phone`);
    const { ref: emailRef, ...email } = register(`${propName}.email`);

    return (
        <>
            <Grid item xs={12} lg={6}>
                <TextField
                    inputRef={phoneRef}
                    {...phone}
                    type="tel"
                    placeholder="Téléphone"
                    variant="outlined"
                    fullWidth
                    disabled={disabled}
                    error={Boolean(errors[propName]?.phone)}
                    helperText={errors[propName]?.phone?.message}
                />
            </Grid>
            <Grid item xs={12} lg={6}>
                <TextField
                    inputRef={emailRef}
                    {...email}
                    type="email"
                    placeholder="Email"
                    variant="outlined"
                    fullWidth
                    disabled={disabled}
                    error={Boolean(errors[propName]?.email)}
                    helperText={errors[propName]?.email?.message}
                />
            </Grid>
        </>
    );
};

export default ContactForm;
