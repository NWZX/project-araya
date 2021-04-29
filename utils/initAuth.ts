import { init } from 'next-firebase-auth';

const initAuth = (): void => {
    try {
        const firePublicConfig =
            process.env.NEXT_PUBLIC_FIREBASE_CONFIG && JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
        const firePrivateConfig = process.env.FIREBASE_CREDENTIAL && JSON.parse(process.env.FIREBASE_CREDENTIAL);

        const keys: string[] = [];
        process.env.COOKIE_SECRET_CURRENT && keys.push(process.env.COOKIE_SECRET_CURRENT);
        process.env.COOKIE_SECRET_PREVIOUS && keys.push(process.env.COOKIE_SECRET_PREVIOUS);

        init({
            authPageURL: '/auth/login',
            appPageURL: '/',
            loginAPIEndpoint: '/api/auth/login', // required
            logoutAPIEndpoint: '/api/auth/logout', // required
            // Required in most cases.
            firebaseAdminInitConfig: {
                credential: firePrivateConfig,
            },
            firebaseClientInitConfig: firePublicConfig,
            cookies: {
                name: 'araya', // required (araya)
                // Keys are required unless you set `signed` to `false`.
                // The keys cannot be accessible on the client side.
                keys: keys,
                httpOnly: true,
                maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
                overwrite: true,
                path: '/',
                sameSite: 'strict',
                secure: false, // set this to false in local (non-HTTPS) development
                signed: true,
            },
        });
    } catch (e) {
        return e;
    }
};

export default initAuth;
