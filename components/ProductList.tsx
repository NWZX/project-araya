import { Grid, IconButton, List, ListItem, ListSubheader } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useContext } from 'react';
import ProductButton from './ProductButton';

import { DialogDataContext, IProduct, IProductGroup } from '../interfaces';
import useSWR from 'swr';
import { fetchGetJSON } from '../utils/apiHelpers';

interface Props {
    className?: string;
    group: IProductGroup;
    edit?: boolean;
}

const ProductList = ({ group, edit }: Props): JSX.Element => {
    const dialogContext = useContext(DialogDataContext);
    const setSelectProduct = dialogContext.selectProduct?.[1];
    const setUpdateProduct = dialogContext.updateProduct?.[1];
    //const setAddGroup = dialogContext.addGroup?.[1];
    const setDelGroup = dialogContext.delGroup?.[1];
    const setAddProduct = dialogContext.addProduct?.[1];

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
                                        setDelGroup && setDelGroup(group);
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
                                    edit
                                        ? setUpdateProduct && setUpdateProduct(v)
                                        : setSelectProduct && setSelectProduct(v);
                                }}
                            />
                        </Grid>
                    ))}
                    {edit && (
                        <Grid item xs={12} lg={3}>
                            <ProductButton
                                title="Ajouter un produit"
                                onClick={() => {
                                    //setAddGroup && setAddGroup(true);
                                    setAddProduct && setAddProduct(group);
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
