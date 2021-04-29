import {
    AppBar,
    Toolbar,
    Typography,
    Grid,
    useScrollTrigger,
    Button,
    createStyles,
    makeStyles,
    Theme,
    Avatar,
} from '@material-ui/core';
import Link from 'next/link';
import { useAuthUser } from 'next-firebase-auth';
import React from 'react';

interface Props {
    disablePadding?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            color: theme.palette.text.primary,
        },
    }),
);

const TopBar = ({ disablePadding }: Props): JSX.Element => {
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 1 });
    const classes = useStyles();
    const user = useAuthUser();

    return (
        <>
            <AppBar elevation={0} style={{ background: !trigger ? 'rgba(0,0,0,0)' : undefined }}>
                <Toolbar>
                    <Grid alignItems="center" container>
                        <Grid item xs={5} md={3}>
                            <Typography variant="h5">LOGO(ARAYA)</Typography>
                        </Grid>
                        <Grid item xs={false} md={6}></Grid>
                        <Grid item container xs={7} md={3} spacing={1} justify="flex-end" alignItems="center">
                            {user.firebaseUser ? (
                                <Grid item>
                                    <Link href="/account">
                                        <Avatar />
                                    </Link>
                                </Grid>
                            ) : (
                                <>
                                    <Grid item>
                                        <Link href="/auth/login">
                                            <Button variant="text" className={classes.link}>
                                                Sign In
                                            </Button>
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/auth/register">
                                            <Button variant="contained" color="secondary" className={classes.link}>
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            {!disablePadding && !trigger && <Toolbar />}
        </>
    );
};

export default TopBar;
