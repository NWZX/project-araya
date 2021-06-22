import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    makeStyles,
    createStyles,
    Theme,
    Switch,
    FormGroup,
    FormControlLabel,
    InputAdornment,
    Hidden,
    IconButton,
    colors,
} from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import EuroIcon from '@material-ui/icons/Euro';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Map } from 'immutable';
import { IProduct, IProductOption, IProductOptionGroup } from 'interfaces';
import { useDialogData } from 'interfaces/StoreDialogContext';
import { UniqueIdGenerator } from 'utils/UIDG';

import firebase from 'firebase';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            marginBottom: theme.spacing(1),
        },
        DialogContent: {
            overflowY: 'hidden',
        },
    }),
);

interface InputsForm {
    title: string;
    description: string;
    price: number;
}
interface IOptionGroupData {
    title: string;
    type: boolean;
}
interface IOptionData {
    key: string;
    id: string;
    title: string;
    price: number;
}

const ArrayToMap = (
    groups: IProductOptionGroup[] | undefined,
): [Map<string, IOptionGroupData>, Map<string, IOptionData>] | undefined => {
    if (!groups) {
        return undefined;
    }

    let mapGroups = Map<string, IOptionGroupData>();
    let mapOption = Map<string, IOptionData>();
    let lastTimestamp = 0;
    groups.forEach((v) => {
        const { id, option, ...data } = v;
        option.forEach((w) => {
            const { price, ...x } = w;
            const uniqueId = UniqueIdGenerator.generate(lastTimestamp);
            lastTimestamp = uniqueId.timestamp;
            mapOption = mapOption.set(uniqueId.uid, { key: id, price: price / 100, ...x });
        });
        mapGroups = mapGroups.set(id, data);
    });
    return [mapGroups, mapOption];
};

const ProductUpdateDialog = (): JSX.Element => {
    const classes = useStyles();
    const { currentDialog, selectedProduct, closeDialog } = useDialogData();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InputsForm>({
        mode: 'onTouched',
    });
    //#region CustomForm Option State
    const [optionGroupData, setOptionGroupData] = useState<Map<string, IOptionGroupData>>(
        Map<string, IOptionGroupData>(),
    );
    const [optionData, setOptionData] = useState<Map<string, IOptionData>>(Map<string, IOptionData>());
    useEffect(() => {
        if (selectedProduct?.optionGroup) {
            reset({
                title: selectedProduct?.title,
                description: selectedProduct?.description,
                price: (selectedProduct?.price || 0) / 100,
            });
            const convert = ArrayToMap(selectedProduct.optionGroup);
            if (convert) {
                setOptionGroupData(convert[0]);
                setOptionData(convert[1]);
            }
        }
        return () => {
            setOptionGroupData(Map<string, IOptionGroupData>());
            setOptionData(Map<string, IOptionData>());
        };
    }, [selectedProduct, reset]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateGroupData = (key: string, e: any): void => {
        const old = optionGroupData?.get(key);
        if (old) {
            const value = optionGroupData?.set(key, {
                ...old,
                [e.target.name]: e.target.value,
            });
            setOptionGroupData(value);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData = (key: string, e: any): void => {
        const old = optionData?.get(key);
        if (old) {
            const value = optionData?.set(key, {
                ...old,
                [e.target.name]: e.target.value,
            });
            setOptionData(value);
        }
    };
    //#endregion

    const handleClose = (): void => {
        reset();
        setOptionGroupData(optionGroupData?.clear());
        setOptionData(optionData.clear());
        closeDialog();
    };
    const handleDelete = async (): Promise<void> => {
        try {
            if (selectedProduct?.id) {
                await firebase.firestore().collection('products').doc(selectedProduct.id).delete();
                handleClose();
            }
        } catch (error) {
            console.error(error.message);
        }
    };
    const onSubmit = async (data: InputsForm): Promise<void> => {
        try {
            if (selectedProduct) {
                const optionGroup: IProductOptionGroup[] = [];
                optionGroupData.forEach((v, k) => {
                    const o: IProductOption[] = [];
                    optionData
                        .filter(({ key }) => key == k)
                        .forEach(({ id, price, title }) => {
                            o.push({ id, price: price * 100, title });
                        });
                    optionGroup.push({
                        title: v.title,
                        type: v.type,
                        id: k,
                        option: o,
                    });
                });

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                const product: IProduct = {
                    title: data.title,
                    description: data.description,
                    price: data.price * 100,
                    optionGroup,
                };
                await firebase
                    .firestore()
                    .doc('products/' + selectedProduct.id)
                    .set(product, { merge: true });
                handleClose();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const { ref: titleRef, ...title } = register('title');
    const { ref: descriptionRef, ...description } = register('description');
    const { ref: priceRef, ...price } = register('price');

    return (
        <Dialog open={currentDialog == 'update-product'} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle id="form-dialog-title">
                <Grid container>
                    <Grid item container xs={10} justify="flex-start" alignContent="center">
                        <Grid item>Modifier un produit</Grid>
                    </Grid>
                    <Grid item container xs={2} justify="flex-end" alignContent="center">
                        <Grid item>
                            <IconButton style={{ color: colors.red[400] }} onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className={classes.DialogContent}>
                    <Grid container spacing={2}>
                        <Grid item container xs={12} lg={12} spacing={1}>
                            <Grid item xs={12}>
                                <TextField
                                    type="text"
                                    inputRef={titleRef}
                                    {...title}
                                    label="Nom"
                                    variant="outlined"
                                    fullWidth
                                    className={classes.textField}
                                    error={Boolean(errors.title)}
                                    helperText={errors.title?.message}
                                />
                                <TextField
                                    type="text"
                                    inputRef={descriptionRef}
                                    {...description}
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    className={classes.textField}
                                    error={Boolean(errors.description)}
                                    helperText={errors.description?.message}
                                />
                                <TextField
                                    type="number"
                                    inputRef={priceRef}
                                    {...price}
                                    label="Prix"
                                    variant="outlined"
                                    fullWidth
                                    error={Boolean(errors.price)}
                                    helperText={errors.price?.message}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container xs={12} lg={12} spacing={1}>
                            <Grid item container xs={12} justify="center" alignItems="center" spacing={1}>
                                <Button
                                    fullWidth
                                    onClick={() => {
                                        const value = optionGroupData?.set(UniqueIdGenerator.generate().uid, {
                                            title: '',
                                            type: true,
                                        });
                                        setOptionGroupData(value);
                                    }}
                                >
                                    Ajouter un groupe
                                </Button>
                            </Grid>
                            {optionGroupData.toArray().map(([k, v]) => (
                                <Grid key={k} item container xs={12} spacing={1}>
                                    <Grid item container xs={12} alignItems="center" justify="center" spacing={1}>
                                        <Grid item xs={12} sm={8} md={9}>
                                            <TextField
                                                type="text"
                                                label="Groupe"
                                                name="title"
                                                variant="outlined"
                                                value={v.title}
                                                onChange={(e) => {
                                                    updateGroupData(k, e);
                                                }}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item>
                                            <FormGroup row>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={v.type}
                                                            name="type"
                                                            onChange={(e, c) => {
                                                                updateGroupData(k, {
                                                                    target: { name: e.target.name, value: c },
                                                                });
                                                            }}
                                                        />
                                                    }
                                                    label="Lier"
                                                />
                                            </FormGroup>
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                style={{ color: colors.red[400] }}
                                                onClick={() => {
                                                    optionData.deleteAll(
                                                        optionData.filter(({ key }) => key == k).keys(),
                                                    );
                                                    setOptionGroupData(optionGroupData.delete(k));
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                        {optionData
                                            .filter(({ key }) => key == k)
                                            .toArray()
                                            .map(([l, w]) => {
                                                return (
                                                    <Grid
                                                        key={l}
                                                        item
                                                        container
                                                        xs={12}
                                                        alignItems="center"
                                                        justify="center"
                                                        spacing={1}
                                                    >
                                                        <Grid item>
                                                            <DragIndicatorIcon />
                                                        </Grid>
                                                        <Grid item xs={10} sm={6} md={8} lg={5} xl={6}>
                                                            <TextField
                                                                type="text"
                                                                label="Option"
                                                                variant="outlined"
                                                                fullWidth
                                                                name="title"
                                                                value={w.title}
                                                                onChange={(e) => {
                                                                    updateData(l, e);
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Hidden smUp>
                                                            <Grid item>
                                                                <DragIndicatorIcon />
                                                            </Grid>
                                                        </Hidden>
                                                        <Grid item>
                                                            <TextField
                                                                type="number"
                                                                name="price"
                                                                label="Prix"
                                                                variant="outlined"
                                                                value={w.price}
                                                                onChange={(e) => {
                                                                    updateData(l, e);
                                                                }}
                                                                onWheel={(e) => e.currentTarget.blur()}
                                                                fullWidth
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <EuroIcon />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })}
                                        <Grid item container xs={10} alignItems="center" spacing={1}>
                                            <Button
                                                fullWidth
                                                onClick={() => {
                                                    const value = optionData?.set(UniqueIdGenerator.generate().uid, {
                                                        key: k,
                                                        id: UniqueIdGenerator.generate().uid,
                                                        title: '',
                                                        price: 0,
                                                    });
                                                    setOptionData(value);
                                                }}
                                            >
                                                Ajouter une option
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Annuler
                    </Button>
                    <Button type="submit" color="primary">
                        Modifier
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProductUpdateDialog;
