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
import { DialogDataContext, IProductOption } from '../interfaces';

interface Props {}

const ProductDetailDialog = ({}: Props): JSX.Element => {
    const dialogContext = useContext(DialogDataContext);
    const product = dialogContext.selectProduct?.[0];
    const setProduct = dialogContext.selectProduct?.[1];
    const { addItem } = useShoppingCart();
    const [optionState, setOptionState] = useState<Map<string, [boolean, IProductOption]>>(
        Map<string, [boolean, IProductOption]>(),
    );
    const [optionStateRadio, setOptionStateRadio] = useState<Map<string, [string, IProductOption]>>(
        Map<string, [string, IProductOption]>(),
    );

    const onSubmit = (): void => {
        //TRASH CODE NEED REVIEW
        if (product && product.id) {
            let optionString = '';
            const optionNames: string[] = [];
            let optionPrice = 0;
            const option = Array.from(
                optionState
                    .filter((v) => {
                        if (v[0]) {
                            optionPrice += v[1].price;
                            optionNames.push(v[1].title);
                        }
                        return v[0];
                    })
                    .keys(),
            );
            optionString = ' ' + option.join(' ');
            optionStateRadio.forEach((v) => {
                option.push(v[0]);
                optionPrice += v[1].price;
                optionNames.push(v[1].title);
                optionString += ` ${v}`;
            });

            addItem({
                id: product.id + optionString,
                name: product.title,
                currency: 'eur',
                price: product.price + optionPrice,
                description: product.description,
                image: undefined,
                option: option,
                optionNames: optionNames,
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
                                    setOptionStateRadio(
                                        optionStateRadio.set('radio' + i, [v.option[0].id, v.option[0]]),
                                    )}
                                {v.type ? (
                                    <RadioGroup
                                        row
                                        value={optionState.get('radio' + i)}
                                        onChange={(_, c) => {
                                            const price = v.option.find((x) => x.id == c) || {
                                                id: '',
                                                price: 0,
                                                title: '',
                                            };
                                            setOptionStateRadio(optionStateRadio.set('radio' + i, [c, price]));
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
                                                ? setOptionState(
                                                      optionState.set(w.id, [false, { id: '', price: 0, title: '' }]),
                                                  )
                                                : null;

                                            return (
                                                <FormControlLabel
                                                    key={w.id}
                                                    control={
                                                        <Checkbox
                                                            checked={optionState.get(w.id)?.[0]}
                                                            onChange={(_, c) => {
                                                                setOptionState(optionState.set(w.id, [c, w]));
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
