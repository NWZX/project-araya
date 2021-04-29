import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../utils/theme';
import { useEffect } from 'react';
import { SnackbarProvider } from 'notistack';
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import initAuth from '../utils/initAuth';
initAuth();

import { CartProvider } from 'use-shopping-cart';
import getStripe from '../utils/getStripeJS';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <GlobalStyles />
            <SnackbarProvider maxSnack={3}>
                <CartProvider mode="checkout-session" stripe={getStripe()} currency="EUR">
                    <Component {...pageProps} />
                </CartProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default MyApp;
