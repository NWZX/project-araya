import {
    List,
    ListSubheader,
    ListItem,
    Typography,
    Divider,
    Box,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    IconButton,
} from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';
import { formatCurrencyString, useShoppingCart } from 'use-shopping-cart';
import { EServiceType } from '../interfaces';

interface Props {
    deliveryFee?: number;
}

const PayementRecipe = ({ deliveryFee }: Props): JSX.Element => {
    const { totalPrice, cartCount, cartDetails, removeItem } = useShoppingCart();
    const router = useRouter();
    const items = [];
    for (const id in cartDetails) {
        items.push(cartDetails[id]);
    }
    const [deliveryMode, setDeliveryMode] = useState(EServiceType.Delivery);

    return (
        <>
            <List subheader={<ListSubheader>Votre commande</ListSubheader>}>
                {items.map((v) => (
                    <Fragment key={v.id}>
                        <ListItem>
                            <IconButton
                                onClick={() => {
                                    removeItem(v.id);
                                }}
                            >
                                <RemoveCircleIcon />
                            </IconButton>
                            <Typography variant="h5" color="textPrimary" align="justify">
                                x{v.quantity} {v.name}
                            </Typography>
                            <Typography variant="h5" color="textPrimary" style={{ marginLeft: 'auto' }}>
                                {formatCurrencyString({
                                    currency: 'eur',
                                    language: 'fr',
                                    value: v.value,
                                })}
                            </Typography>
                        </ListItem>
                        <Divider variant="middle" style={{ borderTop: '1px dashed grey' }} />
                    </Fragment>
                ))}
            </List>
            <Divider variant="middle" />
            <Box textAlign="center">
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        name="serviceType"
                        value={deliveryMode}
                        onChange={(_, v) => {
                            setDeliveryMode(parseInt(v));
                        }}
                    >
                        <FormControlLabel value={EServiceType.Delivery} control={<Radio />} label="Livraison" />
                        <FormControlLabel value={EServiceType.TakeAway} control={<Radio />} label="Click&Collect" />
                    </RadioGroup>
                </FormControl>
            </Box>
            <Divider variant="middle" />
            <List>
                <Fragment>
                    <ListItem>
                        <Typography variant="h5" color="textPrimary" align="justify">
                            Sous-Total
                        </Typography>
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: 'auto' }}>
                            {formatCurrencyString({
                                currency: 'eur',
                                language: 'fr',
                                value: totalPrice,
                            })}
                        </Typography>
                    </ListItem>
                </Fragment>
                <Fragment>
                    <ListItem>
                        <Typography variant="h5" color="textPrimary" align="justify">
                            Frais de service
                        </Typography>
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: 'auto' }}>
                            {formatCurrencyString({
                                currency: 'eur',
                                language: 'fr',
                                value: totalPrice * (0.15 + 0.15 * 0.2),
                            })}
                        </Typography>
                    </ListItem>
                    {deliveryFee && (
                        <ListItem>
                            <Typography variant="h5" color="textPrimary" align="justify">
                                Frais de livraison
                            </Typography>
                            <Typography variant="h5" color="textPrimary" style={{ marginLeft: 'auto' }}>
                                {formatCurrencyString({
                                    currency: 'eur',
                                    language: 'fr',
                                    value: deliveryFee,
                                })}
                            </Typography>
                        </ListItem>
                    )}
                    <Divider variant="middle" style={{ borderTop: '1px dashed grey' }} />
                </Fragment>
            </List>
            <Typography variant="h4" align="center" color="textPrimary" style={{ padding: '5%' }}>
                Total:{' '}
                {formatCurrencyString({
                    currency: 'eur',
                    value: totalPrice + (deliveryFee || 0) + totalPrice * (0.15 + 0.15 * 0.2),
                    language: 'fr',
                })}
                <Button
                    variant="outlined"
                    fullWidth
                    color="primary"
                    disabled={cartCount <= 0}
                    onClick={() => router.push('/orders/start')}
                >
                    Commander
                </Button>
            </Typography>
        </>
    );
};

export default PayementRecipe;
