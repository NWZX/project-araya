import { Grid, TextField } from '@material-ui/core';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends UseFormReturn<any> {
    disabled?: boolean;
}

const AccountForm = ({ register, formState: { errors }, disabled }: Props): JSX.Element => {
    const { ref: emailRef, ...email } = register(`email`);
    const { ref: phoneRef, ...phone } = register(`phone`);
    const { ref: passwordRef, ...password } = register(`password`);

    return (
        <>
            <Grid item xs={12}>
                <TextField
                    inputRef={emailRef}
                    {...email}
                    type="email"
                    placeholder="Email"
                    variant="outlined"
                    fullWidth
                    disabled={disabled}
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    inputRef={phoneRef}
                    {...phone}
                    type="tel"
                    placeholder="Tel.Mobile"
                    variant="outlined"
                    fullWidth
                    disabled={disabled}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    inputRef={passwordRef}
                    {...password}
                    type="password"
                    placeholder="Password"
                    variant="outlined"
                    fullWidth
                    disabled={disabled}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                />
            </Grid>
        </>
    );
};

export default AccountForm;
