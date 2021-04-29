import {
    makeStyles,
    GridList,
    GridListTile,
    GridListTileBar,
    Fab,
    ButtonBase,
    Hidden,
    Typography,
    Chip,
    Grid,
} from '@material-ui/core';
import NearMeIcon from '@material-ui/icons/NearMe';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

const isScrollZero = (v?: number): boolean => {
    if (!v || v <= 0) return true;
    return false;
};

const useStyles = makeStyles((theme) => ({
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',

        '&::-webkit-scrollbar': {
            height: '10px',
        },
        '&::-webkit-scrollbar-track': {
            visibility: 'hidden',
        },
        '&::-webkit-scrollbar-thumb': {
            visibility: 'hidden',
        },
    },
    ListTile: {
        maxWidth: 245,
        minWidth: 245,
        borderRadius: 2,
        opacity: 0.9,
    },
    SubListTitle: {
        borderRadius: 2,
        boxShadow: theme.shadows[1],
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
        padding: theme.spacing(2),
    },
}));
const TicketWheel = () => {
    const classes = useStyles();
    const router = useRouter();
    const [tickets, setTickets] = useState([]);
    const restaurant = [
        'Foodiva',
        'Drinkology',
        'Fryti',
        'Foodex',
        'Drinkonuts',
        'Fastlance',
        'Fastable',
        'Burgerish',
        'Fastlux',
    ];
    const ref = useRef<HTMLUListElement | null>(null);
    useEffect(() => {
        fetch('https://picsum.photos/v2/list?page=1&limit=9')
            .then((res) => res.json())
            .then((out) => {
                const items = out.map(
                    ({ id, download_url: url }: { id: string; author: string; download_url: string }, i) => {
                        return {
                            id: id,
                            title: restaurant[i],
                            url: url,
                        };
                    },
                );
                setTickets(items);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <GridList innerRef={ref} className={classes.gridList} cellHeight={200} spacing={10}>
                {tickets.map(
                    (tile: { id: string | number | undefined; title: string | undefined; url: string | undefined }) => (
                        <GridListTile
                            key={tile.id}
                            className={classes.ListTile}
                            component={ButtonBase}
                            classes={{ tile: classes.SubListTitle }}
                        >
                            <img src={tile.url} alt={tile.title} />
                            <GridListTileBar
                                title={tile.title}
                                subtitle={
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Chip icon={<QueryBuilderIcon />} label="Ouvert" />
                                        </Grid>
                                        <Grid item>
                                            <Chip icon={<NearMeIcon />} label="500 m" />
                                        </Grid>
                                    </Grid>
                                }
                            />
                        </GridListTile>
                    ),
                )}
            </GridList>
            <Fab
                aria-label="see more"
                style={{
                    position: 'absolute',
                    width: 64,
                    height: 64,
                    bottom: '35%',
                    left: '79%',
                    display:
                        ref.current?.scrollLeft == (ref.current?.scrollWidth || 0) - (ref.current?.offsetWidth || 0)
                            ? 'none'
                            : undefined,
                }}
                onClick={() => {
                    ref.current?.scrollTo({ left: ref.current.scrollLeft + 900, behavior: 'smooth' });
                }}
            >
                <ArrowForwardIcon />
            </Fab>
            <Fab
                aria-label="see more"
                style={{
                    position: 'absolute',
                    width: 64,
                    height: 64,
                    bottom: '35%',
                    left: '18%',
                    display: isScrollZero(ref.current?.scrollLeft) ? 'none' : undefined,
                }}
                onClick={() => {
                    ref.current?.scrollTo({ left: ref.current.scrollLeft - 900, behavior: 'smooth' });
                }}
            >
                <ArrowBackIcon />
            </Fab>
        </div>
    );
};
export default TicketWheel;
