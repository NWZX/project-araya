import Link from 'next/link';
import Layout from '../../../components/Layout';
import {
    Grid,
    Typography,
    makeStyles,
    createStyles,
    Theme,
    useMediaQuery,
    useTheme,
    Button,
    Paper,
    Stepper,
    Step,
    StepLabel,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@material-ui/core';
import { formatCurrencyString } from 'use-shopping-cart';
import { NextPage } from 'next';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        cover: {
            minHeight: '100vh',
            backgroundImage:
                "url('https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=masimo-grabar-NzHRSLhc6Cs-unsplash.jpg&w=640')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        },
        a: {
            textDecoration: 'none',
            color: theme.palette.secondary.main,
            '&:visited': {
                color: theme.palette.secondary.main,
            },
        },
    }),
);

const PayementStepPage: NextPage = (): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const steps = ['Detail de la commande', 'Payement', 'Validé'];
    const rows = [
        { title: 'BigMac', price: 5000 },
        { title: 'BigMac', price: 5000 },
    ];

    return (
        <Layout title="Connexion" disableHeader>
            <Grid container alignItems="center" justify="center">
                <Grid item container xs={12} alignItems="center" justify="center">
                    <Grid item xs={false} lg={6} className={classes.cover}></Grid>
                    <Grid item container xs={12} lg={6} style={{ padding: '5%' }}>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <Stepper activeStep={3} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Grid>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <Typography variant={isMobile ? 'h3' : 'h2'} align="left">
                                Merci pour votre commande
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <Typography variant="button" component="p" align="left">
                                Un reçu a été envoyer à votre boite mail.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {rows.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="left">{row.title}</TableCell>
                                                <TableCell align="right">
                                                    {formatCurrencyString({
                                                        currency: 'eur',
                                                        value: row.price,
                                                        language: 'fr',
                                                    })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <Link href="/">
                                <Button variant="outlined" fullWidth>
                                    Retourner à la page d&apos;accueil
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default PayementStepPage;
