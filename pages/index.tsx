import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

import { AuthAction, withAuthUser } from 'next-firebase-auth';

import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AlgoliaIcon from '../components/Icons/AlgoliaIcon';

import { useRouter } from 'next/router';
import { NextPage } from 'next';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        video: {
            right: 0,
            bottom: 0,
            position: 'fixed',
            minHeight: '100%',
            minWidth: '100%',
        },
        searchBox: {
            minHeight: '90vh',
            position: 'fixed',
            color: 'white',
        },
        searchInput: {
            backgroundColor: theme.palette.background.paper,
            borderRadius: 50,
        },
        wheel: {
            position: 'absolute',
            left: '25%',
            bottom: '50%',
        },
        link: {
            color: theme.palette.text.primary,
        },
    }),
);

const IndexPage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (e: any): void => {
        e.preventDefault();
        router.push('stores/list/' + encodeURI(search));
    };
    return (
        <Layout title="Araya">
            <video autoPlay loop muted className={classes.video}>
                <source src="ressource/intro.webm" type="video/webm" />
                <source src="ressource/intro.mp4" type="video/mp4" />
            </video>
            <Grid container alignItems="center" justify="center" className={classes.searchBox}>
                <Grid item container xs={12} sm={10} lg={10} spacing={2} alignItems="center" justify="center">
                    <Grid item xs={12}>
                        <Typography variant={isMobile ? 'h3' : 'h2'} align="center">
                            Commander, Recupéré ou Être livré
                        </Typography>
                        <Typography variant="button" component="p" align="center">
                            Ridiculus sociosqu cursus neque cursus curae ante scelerisque vehicula.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={10} lg={7}>
                        <form onSubmit={onSubmit}>
                            <TextField
                                InputProps={{
                                    className: classes.searchInput,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton disabled>
                                                <LocationSearchingIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <AlgoliaIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                name="search"
                                variant="outlined"
                                placeholder="Search by Algolia"
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                    </Grid>
                </Grid>
                <Grid item container justify="center" xs={12}>
                    <Link href="/stores/list">
                        <Fab color="primary" variant="extended" className={classes.link}>
                            <ArrowDownwardIcon />
                            Voir Plus
                        </Fab>
                    </Link>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default withAuthUser({
    whenAuthed: AuthAction.RENDER,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
})(IndexPage);
