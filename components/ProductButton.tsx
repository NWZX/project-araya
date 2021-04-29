import { ButtonBase, makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { formatCurrencyString } from 'use-shopping-cart';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            position: 'relative',
            height: 300,
            boxShadow: theme.shadows[2],
            [theme.breakpoints.down('xs')]: {
                width: '100% !important', // Overrides inline-style
                height: 200,
            },
            '&:hover, &$focusVisible': {
                zIndex: 1,
                '& $imageBackdrop': {
                    opacity: 0.15,
                },
                '& $imageMarked': {
                    opacity: 0,
                },
                '& $imageTitle': {
                    border: '4px solid currentColor',
                },
            },
        },
        focusVisible: {},
        imageButton: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.common.white,
        },
        imageSrc: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
        },
        imageBackdrop: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: theme.palette.common.black,
            opacity: 0.4,
            transition: theme.transitions.create('opacity'),
        },
        imageTitle: {
            position: 'relative',
            padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
        },
        imageMarked: {
            height: 3,
            width: 18,
            backgroundColor: theme.palette.common.white,
            position: 'absolute',
            bottom: -2,
            left: 'calc(50% - 9px)',
            transition: theme.transitions.create('opacity'),
        },
    }),
);

interface Props {
    className?: string;
    onClick?: () => void;
    title: string;
    price?: number;
    imageUrl?: string;
}

const ProductButton = ({ className, onClick, title, price, imageUrl }: Props): JSX.Element => {
    const classes = useStyles();
    return (
        <ButtonBase
            focusRipple
            className={clsx(classes.image, className)}
            focusVisibleClassName={classes.focusVisible}
            style={{
                width: '100%',
            }}
            onClick={onClick}
        >
            <span
                className={classes.imageSrc}
                style={{
                    backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
                }}
            />
            <span className={classes.imageBackdrop} />
            <span className={classes.imageButton}>
                <Typography component="span" variant="subtitle1" color="inherit" className={classes.imageTitle}>
                    {title}
                    <br />
                    {price && formatCurrencyString({ currency: 'eur', value: price, language: 'fr' })}
                </Typography>
            </span>
        </ButtonBase>
    );
};

export default ProductButton;
