import {
    ButtonBase,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    Chip,
    CardActions,
    createStyles,
    makeStyles,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import NearMeIcon from '@material-ui/icons/NearMe';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { IStore } from '../interfaces';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            maxWidth: '100%',
        },
        media: {
            height: 0,
            paddingTop: '40.0%', // 16:9
        },
        titleClamp: {
            overflow: 'hidden',
            display: '-webkit-box',
            '-webkit-line-clamp': 1,
            '-webkit-box-orient': 'vertical',
        },
    }),
);

interface Props {
    store: IStore;
    onClick?: () => void;
}

const ShopCard = ({ store, onClick }: Props): JSX.Element => {
    const classes = useStyles();
    const isDelivery = store.serviceType.isDelivery;
    const isTakeAway = store.serviceType.isTakeAway;

    return (
        <ButtonBase onClick={onClick}>
            <Card variant="outlined" className={classes.root}>
                <CardMedia
                    className={classes.media}
                    image="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=ivan-torres-MQUqbmszGGM-unsplash.jpg&w=640"
                    title="Paella dish"
                />
                <CardContent>
                    <Rating name="half-rating" defaultValue={2.5} precision={0.1} readOnly />
                    <Typography variant="h5" color="textPrimary" component="h2" className={classes.titleClamp}>
                        {store.title}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" component="p" className={classes.titleClamp}>
                        {`${store.address.street}, ${
                            store.address.optional ? '(' + store.address.optional + '), ' : ''
                        }${store.address.zipcode} ${store.address.city}, ${store.address.country}`}
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Chip icon={<QueryBuilderIcon />} label={'Ouvert'} color={'primary'} />
                        </Grid>
                        <Grid item>
                            <Chip icon={<NearMeIcon />} label={`Non determiné`} />
                        </Grid>
                        <Grid item>
                            <Chip
                                icon={isDelivery ? <CheckIcon /> : <CloseIcon />}
                                color={isDelivery ? 'primary' : 'secondary'}
                                label="Livraison"
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                icon={isTakeAway ? <CheckIcon /> : <CloseIcon />}
                                color={isTakeAway ? 'primary' : 'secondary'}
                                label="Take away"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions disableSpacing></CardActions>
            </Card>
        </ButtonBase>
    );
};

export default ShopCard;
