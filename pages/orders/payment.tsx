import Layout from '../../components/Layout';
import {
    Grid,
    Typography,
    makeStyles,
    createStyles,
    Theme,
    useMediaQuery,
    useTheme,
    Stepper,
    Step,
    StepLabel,
} from '@material-ui/core';
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
    const steps = ['Detail de la commande', 'Payment', 'Validé'];

    return (
        <Layout title="Connexion" disableHeader>
            <Grid container alignItems="center" justify="center">
                <Grid item container xs={12} alignItems="center" justify="center">
                    <Grid item xs={false} lg={6} className={classes.cover}></Grid>
                    <Grid item container xs={12} lg={6} style={{ padding: '5%' }}>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <Stepper activeStep={2} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Grid>
                        <Grid item xs={12} style={{ margin: '0.5rem' }}>
                            <Typography variant={isMobile ? 'h3' : 'h2'} align="left">
                                Redirection vers la page de payement...
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default PayementStepPage;
