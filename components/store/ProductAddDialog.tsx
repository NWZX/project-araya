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
} from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import EuroIcon from '@material-ui/icons/Euro';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Map } from 'immutable';
import { IProduct, IProductOption, IProductOptionGroup } from 'interfaces';
import { useDialogData } from 'interfaces/DialogDataContext';
import { UniqueIdGenerator } from 'utils/UIDG';

import firebase from 'firebase';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            marginBottom: theme.spacing(1),
        },
    }),
);

interface InputsForm {
    title: string;
    description: string;
    price: number;
}
interface IOptionData {
    title: string;
    type: boolean;
}

const ProductAddDialog = (): JSX.Element => {
    const classes = useStyles();
    const { currentDialog, selectedGroup, closeDialog } = useDialogData();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InputsForm>();
    //#region CustomForm Option State
    const [optionGroupData, setOptionGroupData] = useState<Map<string, IOptionData>>(Map<string, IOptionData>());
    const [optionData, setOptionData] = useState<
        Map<string, { key: string; id: string; title: string; price: number }>
    >(Map<string, { key: string; id: string; title: string; price: number }>());
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
    const onSubmit = async (data: InputsForm): Promise<void> => {
        try {
            if (selectedGroup) {
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
                const product: Partial<IProduct> = {
                    title: data.title,
                    description: data.description,
                    price: data.price * 100,
                    productGroupId: selectedGroup.id,
                    optionGroup,
                };
                await firebase.firestore().collection('products').add(product);
                handleClose();
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Dialog open={currentDialog == 'add-product'} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle id="form-dialog-title">Création d&apos;un produit</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item container xs={12} lg={12} spacing={1}>
                            <Grid item xs={12}>
                                <TextField
                                    type="text"
                                    {...register('title')}
                                    label="Nom"
                                    variant="outlined"
                                    fullWidth
                                    className={classes.textField}
                                    error={Boolean(errors.title)}
                                    helperText={errors.title?.message}
                                />
                                <TextField
                                    type="text"
                                    {...register('description')}
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
                                    {...register('price')}
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
                                                                label="Prix"
                                                                variant="outlined"
                                                                name="price"
                                                                value={w.price}
                                                                onChange={(e) => {
                                                                    updateData(l, e);
                                                                }}
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
                        Ajouter
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProductAddDialog;
