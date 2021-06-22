import { Grid, IconButton, List, ListItem, ListSubheader } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ProductButton from './ProductButton';

import { IProduct, IProductGroup } from 'interfaces';
import { useDialogData } from 'interfaces/DialogDataContext';
import useSWR from 'swr';
import { fetchGetJSON } from 'utils/apiHelpers';

interface Props {
    className?: string;
    group: IProductGroup;
    edit?: boolean;
}

const ProductList = ({ group, edit }: Props): JSX.Element | JSX.Element[] => {
    const { openDialog, setProduct, setGroup } = useDialogData();

    const { data } = useSWR<IProduct[]>(group.id ? `/api/products/get?pgid=${group.id}` : null, fetchGetJSON);

    return (
        <List
            subheader={
                <ListSubheader>
                    <Grid container>
                        <Grid item container xs={6} justify="flex-start">
                            {group.title}
                        </Grid>
                        {edit && (
                            <Grid item container xs={6} justify="flex-end">
                                <IconButton
                                    onClick={() => {
                                        setGroup(group);
                                        openDialog('del-product-group');
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                </ListSubheader>
            }
        >
            <ListItem>
                <Grid container spacing={4}>
                    {data?.map((v, i) => (
                        <Grid key={i} item xs={12} lg={3}>
                            <ProductButton
                                title={v.title}
                                price={v.price}
                                imageUrl="/ressource/prod1.jpg"
                                onClick={() => {
                                    setProduct(v);
                                    edit ? openDialog('update-product') : openDialog('detail-product');
                                }}
                            />
                        </Grid>
                    ))}
                    {edit && (
                        <Grid item xs={12} lg={3}>
                            <ProductButton
                                title="Ajouter un produit"
                                onClick={() => {
                                    setGroup(group);
                                    openDialog('add-product');
                                }}
                            />
                        </Grid>
                    )}
                </Grid>
            </ListItem>
        </List>
    );
};

export default ProductList;
