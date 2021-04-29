import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Divider,
    FormControl,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    Grid,
} from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { formatCurrencyString, useShoppingCart } from 'use-shopping-cart';
import { Map } from 'immutable';
import { DialogDataContext } from '../interfaces';

interface Props {}

const ProductDetailDialog = ({}: Props): JSX.Element => {
    const dialogContext = useContext(DialogDataContext);
    const product = dialogContext.selectProduct?.[0];
    const setProduct = dialogContext.selectProduct?.[1];
    const { addItem } = useShoppingCart();
    const [optionState, setOptionState] = useState<Map<string, boolean>>(Map<string, boolean>());
    const [optionStateRadio, setOptionStateRadio] = useState<Map<string, string>>(Map<string, string>());

    const onSubmit = (): void => {
        if (product && product.id) {
            let optionString = '';
            const option = Array.from(optionState.filter((v) => v).keys());
            optionString = ' ' + option.join(' ');
            optionStateRadio.forEach((v) => {
                option.push(v);
                optionString += ` ${v}`;
            });

            addItem({
                id: product.id + optionString,
                name: product.title,
                currency: 'eur',
                price: product.price,
                description: product.description,
                image: undefined,
                option: option,
            });
            handleClose();
        }
    };

    const handleClose = (): void => {
        setOptionState(optionState.clear());
        setProduct && setProduct(undefined);
    };

    return (
        <Dialog open={Boolean(product)} onClose={handleClose}>
            <DialogTitle id="form-dialog-title">{product?.title}</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <DialogContentText>{product?.description}</DialogContentText>
                        {product?.optionGroup && <Divider variant="middle" />}
                    </Grid>
                    <Grid item xs={12}>
                        {product?.optionGroup.map((v, i) => (
                            <FormControl key={v.id} component="fieldset">
                                <FormLabel component="legend">{v.title}</FormLabel>
                                {v.type &&
                                    v.option[0].id &&
                                    typeof optionStateRadio.get('radio' + i) === 'undefined' &&
                                    setOptionStateRadio(optionStateRadio.set('radio' + i, v.option[0].id))}
                                {v.type ? (
                                    <RadioGroup
                                        row
                                        value={optionState.get('radio' + i)}
                                        onChange={(_, c) => {
                                            setOptionStateRadio(optionStateRadio.set('radio' + i, c));
                                        }}
                                    >
                                        {v.option.map((w) => (
                                            <FormControlLabel
                                                key={w.id}
                                                value={w.id}
                                                control={<Radio />}
                                                label={`${w.title}(+${formatCurrencyString({
                                                    currency: 'eur',
                                                    language: 'fr',
                                                    value: w.price,
                                                })})`}
                                            />
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <FormGroup row>
                                        {v.option.map((w) => {
                                            typeof optionState.get(w.id) === 'undefined'
                                                ? setOptionState(optionState.set(w.id, false))
                                                : null;

                                            return (
                                                <FormControlLabel
                                                    key={w.id}
                                                    control={
                                                        <Checkbox
                                                            checked={optionState.get(w.id)}
                                                            onChange={(_, c) => {
                                                                setOptionState(optionState.set(w.id, c));
                                                            }}
                                                        />
                                                    }
                                                    label={`${w.title}(+${formatCurrencyString({
                                                        currency: 'eur',
                                                        language: 'fr',
                                                        value: w.price,
                                                    })})`}
                                                />
                                            );
                                        })}
                                    </FormGroup>
                                )}
                            </FormControl>
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Annuler
                </Button>
                <Button onClick={onSubmit} color="primary">
                    Ajouter
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductDetailDialog;
