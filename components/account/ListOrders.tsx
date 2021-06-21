import React, { useState } from 'react';
import clsx from 'clsx';
import {
    Box,
    Button,
    Card,
    CardHeader,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    makeStyles,
    Typography,
    useTheme,
} from '@material-ui/core';
import { EDelivreryStatus, IOrderRecipe } from 'interfaces';
import OrderDetailDialog from './OrderDetailDialog';

const data = [
    {
        id: '5fdc1f2be287790105de4b11',
        amount: 30.5,
        customer: {
            name: 'Ekaterina Tankova',
        },
        createdAt: 1555016400000,
        status: 3,
    },
    {
        id: '5fdc1f2bd1e9d3fb6c2b67bb',
        amount: 25.1,
        customer: {
            name: 'Cao Yu',
        },
        createdAt: 1555016400000,
        status: 5,
    },
    {
        id: '5fdc1f2bd44f243f6dc74d04',
        amount: 10.99,
        customer: {
            name: 'Alexa Richardson',
        },
        createdAt: 1554930000000,
        status: 1,
    },
    {
        id: '5fdc1f2b6807c34ff4251f95',
        amount: 96.43,
        customer: {
            name: 'Anje Keizer',
        },
        createdAt: 1554757200000,
        status: 0,
    },
    {
        id: '5fdc1f2b3993ff4f96fde69f',
        amount: 32.54,
        customer: {
            name: 'Clarke Gillebert',
        },
        createdAt: 1554670800000,
        status: 2,
    },
    {
        id: '5fdc1f2bb21c57927fa76c6e',
        amount: 16.76,
        customer: {
            name: 'Adam Denisov',
        },
        createdAt: 1554670800000,
        status: 6,
    },
];

export const StatusSelector = (
    method: EDelivreryStatus,
): { backgroundColor: string; color: string; text: string; desc: string } => {
    let parameter;
    switch (method) {
        case EDelivreryStatus.Pedding:
            parameter = {
                backgroundColor: '#f5b461',
                color: 'dark',
                text: 'Attente',
                desc: 'En attende de payement',
            };
            break;
        case EDelivreryStatus.Rejected:
            parameter = {
                backgroundColor: '#ec524b',
                color: 'dark',
                text: 'Rejeter',
                desc: 'Payement rejeter',
            };
            break;
        case EDelivreryStatus.Validated:
            parameter = {
                backgroundColor: '#fadcaa',
                color: 'dark',
                text: 'Validé',
                desc: 'Payement accepter',
            };
            break;
        case EDelivreryStatus.Refund:
            parameter = {
                backgroundColor: '#ec524b',
                color: 'dark',
                text: 'Annuler',
                desc: 'Annuler par le vendeur',
            };
            break;
        case EDelivreryStatus.Accepted:
            parameter = {
                backgroundColor: '#a8dda8',
                color: 'dark',
                text: 'Préparation',
                desc: 'En cours de préparation',
            };
            break;
        case EDelivreryStatus.Available:
            parameter = {
                backgroundColor: '#28abb9',
                color: 'dark',
                text: 'Disponible',
                desc: 'Disponible en point de vente',
            };
            break;
        case EDelivreryStatus.Collected:
            parameter = { backgroundColor: '#b2deec', color: 'dark', text: 'Livraison', desc: 'En cours de livraison' };
            break;
        case EDelivreryStatus.Delivered:
            parameter = { backgroundColor: '#03c4a1', color: 'dark', text: 'Livré', desc: '🎉🎉🎉' };
            break;

        default:
            parameter = { backgroundColor: '#794c74', color: 'dark', text: 'Erreur', desc: '' };
            break;
    }
    return parameter;
};
export const StatusCommand = (method: EDelivreryStatus): { children: string; onClick: () => void } | undefined => {
    switch (method) {
        case EDelivreryStatus.Validated:
            return {
                children: 'Commencer la preparation',
                onClick: () => {
                    console.log('started');
                },
            };
        case EDelivreryStatus.Accepted:
            return {
                children: 'Commande prête',
                onClick: () => {
                    console.log('ready');
                },
            };
        case EDelivreryStatus.Available:
            return {
                children: 'Commande délivré',
                onClick: () => {
                    console.log('send');
                },
            };

        default:
            return undefined;
    }
};
export const StatusDisplay = (method: EDelivreryStatus): JSX.Element => {
    const parameter = StatusSelector(method);
    const theme = useTheme();
    return (
        <Typography
            style={{
                backgroundColor: parameter.backgroundColor,
                color: theme.palette.text.primary,
                padding: '0.1rem',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                borderRadius: 3,
            }}
            component="span"
        >
            {parameter.text}
        </Typography>
    );
};

const useStyles = makeStyles(() => ({
    root: {},
    actions: {
        justifyContent: 'flex-end',
    },
}));

interface ILatestOrders {
    className?: string;
}

const ListOrders = ({ className }: ILatestOrders): JSX.Element => {
    const classes = useStyles();
    const [orders] = useState(data);
    const [orderSelected, setOrderSelected] = useState<
        | {
              displayName: string;
              recipe: IOrderRecipe;
              actionTitle?: string;
              onClick?: () => void;
          }
        | undefined
    >();

    return (
        <Card className={clsx(classes.root, className)}>
            <CardHeader title="Commande (WIP)" />
            <Divider />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Client</TableCell>
                        <TableCell sortDirection="desc">
                            <Tooltip enterDelay={300} title="Sort">
                                <TableSortLabel active direction="desc">
                                    Date
                                </TableSortLabel>
                            </Tooltip>
                        </TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => {
                        const command = StatusCommand(order.status);
                        return (
                            <TableRow
                                hover
                                key={order.id}
                                onClick={() => {
                                    setOrderSelected({
                                        actionTitle: command?.children,
                                        onClick: command?.onClick,
                                        displayName: order.customer.name,
                                        recipe: {
                                            total: 1000,
                                            item: [
                                                {
                                                    id: '0',
                                                    name: 'BigMac',
                                                    option: ['Ketchup', 'Grande Frite', 'CocaCola'],
                                                    qty: 2,
                                                    total: 2000,
                                                },
                                                {
                                                    id: '1',
                                                    name: 'RoyalDeluxe',
                                                    option: ['Ketchup', 'Frite', 'Sprite'],
                                                    qty: 1,
                                                    total: 800,
                                                },
                                            ],
                                        },
                                    });
                                }}
                            >
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{StatusDisplay(order.status)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Box display="flex" justifyContent="center" p={2}>
                <Button color="primary" size="small" variant="text">
                    Voir plus
                </Button>
            </Box>
            <OrderDetailDialog order={orderSelected} onClose={() => setOrderSelected(undefined)} />
        </Card>
    );
};

export default ListOrders;
