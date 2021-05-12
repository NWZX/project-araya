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
    Menu,
    MenuItem,
    FormControlLabel,
    Switch,
} from '@material-ui/core';
import Link from 'next/link';
import { useAuthUser } from 'next-firebase-auth';
import React from 'react';
import { useRouter } from 'next/router';

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
    const router = useRouter();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClickMenu = (event: React.MouseEvent<HTMLDivElement>): void => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = (): void => {
        setAnchorEl(null);
    };
    const handleClickAccount = (): void => {
        router.push('/account');
        handleCloseMenu();
    };
    const handleClickLogout = (): void => {
        user.signOut();
        handleCloseMenu();
    };

    const isStorePage: boolean = router.pathname == '/stores/[id]' && Boolean(router.query.id);
    const isStoreEditPage: boolean = router.pathname == '/stores/[id]/edit' && Boolean(router.query.id);
    const accessLevel = (user.claims.accessLevel as unknown) as number;
    const isAdminOrStoreAdmin = user.claims.admin || (accessLevel == 2 && router.query.id == user.id);
    console.log(router.pathname, accessLevel, isAdminOrStoreAdmin);
    return (
        <>
            <AppBar elevation={0} style={{ background: 'rgba(150,255,200,0.5)' }}>
                <Toolbar>
                    <Grid alignItems="center" container>
                        <Grid item xs={5} md={3}>
                            <a href="/">
                                <img src="/icons/ms-icon-310x310.png" alt="Logo Araya" width={48} />
                            </a>
                        </Grid>
                        <Grid item xs={false} md={6}></Grid>
                        <Grid item container xs={7} md={3} spacing={1} justify="flex-end" alignItems="center">
                            {(isStorePage || isStoreEditPage) && isAdminOrStoreAdmin && (
                                <Grid item>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isStoreEditPage}
                                                onChange={() => {
                                                    router.push({
                                                        pathname: isStorePage ? '/stores/[id]/edit' : '/stores/[id]',
                                                        query: { id: router.query.id },
                                                    });
                                                }}
                                                name="checkedB"
                                                color="secondary"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" color="textPrimary">
                                                Modifier le magasin
                                            </Typography>
                                        }
                                    />
                                </Grid>
                            )}
                            {user.firebaseUser ? (
                                <Grid item>
                                    <Avatar onClick={handleClickMenu} />
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleCloseMenu}
                                    >
                                        <MenuItem onClick={handleClickAccount}>Mon compte</MenuItem>
                                        <MenuItem onClick={handleClickLogout}>Deconnexion</MenuItem>
                                    </Menu>
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
