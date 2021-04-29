import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';

import { AuthAction, withAuthUser } from 'next-firebase-auth';
import algoliasearch from 'algoliasearch/lite';

import {
    Grid,
    TextField,
    makeStyles,
    createStyles,
    Theme,
    InputAdornment,
    IconButton,
    Button,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

import Filters from '../../../components/Filters';
import ShopCard from '../../../components/ShopCard';
import { IStore, ITag } from '../../../interfaces';
import firebase from 'firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';
import AlgoliaIcon from '../../../components/Icons/AlgoliaIcon';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        pagination: {
            justifyContent: 'center',
            margin: theme.spacing(2),
        },
        item: {
            padding: theme.spacing(1),
        },
    }),
);

const StoreListPage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const router = useRouter();
    const [toggleMap, setToggleMap] = useState(false);
    const MapWithNoSSR = dynamic(() => import('../../../components/Map'), {
        ssr: false,
    });

    const [isDelivery, setIsDelivery] = useState(false);
    const [isTakeAway, setIsTakeAway] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[] | undefined>(undefined);
    const [search, setSearch] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>();
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY) {
            const searchClient = algoliasearch(
                process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
                process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
            );
            const index = searchClient.initIndex('stores');
            index
                .search<IStore>(search, { hitsPerPage: 5, page: page })
                .then((v) => {
                    v.hits = v.hits.filter((v) => {
                        const cd1 = !isDelivery || (isDelivery && v.serviceType.isDelivery);
                        const cd2 = !isTakeAway || (isTakeAway && v.serviceType.isTakeAway);
                        const cd3 = !selectedTags || v.tags.filter((t) => selectedTags.includes(t)).length > 0;
                        return cd1 && cd2 && cd3;
                    });
                    v.nbHits = v.hits.length;
                    setPage(v.page);
                    setResult(v);
                });
        }
    }, [isDelivery, isTakeAway, page, search, selectedTags]);

    const [tags] = useCollectionDataOnce<ITag>(firebase.firestore().collection('tags').limit(25), {
        idField: 'id',
    });

    return (
        <Layout title="Restaurant disponible">
            <Grid container justify="center">
                <Grid item container alignItems="center" justify="center" xs={12} lg={12}>
                    <Grid
                        item
                        xs={12}
                        lg={7}
                        className={classes.item}
                        style={{ display: toggleMap ? 'block' : 'none' }}
                    >
                        <MapWithNoSSR
                            heigth={350}
                            positionCenter={
                                result?.hits[0]?.address.geolocation &&
                                new firebase.firestore.GeoPoint(
                                    result?.hits[0]?.address.geolocation._latitude,
                                    result?.hits[0]?.address.geolocation._longitude,
                                )
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            positionMarker={result?.hits?.map((v: any) => {
                                return {
                                    marker: new firebase.firestore.GeoPoint(
                                        v.address.geolocation._latitude,
                                        v.address.geolocation._longitude,
                                    ),
                                    title: v.title,
                                };
                            })}
                            zoom={13}
                            scrollZoom
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" justify="center" xs={12} lg={12}>
                    <Grid item xs={12} lg={2} className={classes.item}>
                        <Button
                            variant="outlined"
                            fullWidth
                            style={{ height: 56 }}
                            onClick={() => {
                                setToggleMap(!toggleMap);
                            }}
                        >
                            Voir la carte
                        </Button>
                    </Grid>
                    <Grid item xs={12} lg={5} className={classes.item}>
                        <TextField
                            variant="outlined"
                            placeholder="Search by Algolia"
                            fullWidth
                            InputProps={{
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
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item container justify="center" xs={12} lg={12}>
                    <Grid item xs={12} lg={2} className={classes.item}>
                        <Filters
                            tags={tags}
                            onOptionChange={(deliv, take) => {
                                typeof deliv == 'boolean' ? setIsDelivery(deliv) : null;
                                typeof take == 'boolean' ? setIsTakeAway(take) : null;
                            }}
                            onTagsChange={(selected) => {
                                console.log(selected);
                                if (selected.length > 0) setSelectedTags(selected);
                                else setSelectedTags(undefined);
                            }}
                        />
                    </Grid>
                    <Grid item container justify="center" xs={12} lg={5}>
                        {result?.hits?.map((v: IStore, i: number) => (
                            <Grid key={i} item xs={12} md={6} className={classes.item}>
                                <ShopCard
                                    store={v}
                                    onClick={() => {
                                        router.push('/stores/' + v.id);
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" justify="center" xs={12} lg={12}>
                    <Grid item xs={12} lg={2}></Grid>
                    <Grid item xs={12} lg={5}>
                        <Pagination
                            count={result?.nbPages}
                            page={page + 1}
                            onChange={(_, v) => setPage(v - 1)}
                            classes={{ ul: classes.pagination }}
                            color="primary"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default withAuthUser({
    whenAuthed: AuthAction.RENDER,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
})(StoreListPage);
