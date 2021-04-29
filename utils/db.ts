import admin from 'firebase-admin';

const firePrivateConfig = process.env.FIREBASE_CREDENTIAL && JSON.parse(process.env.FIREBASE_CREDENTIAL);

export const getFirebaseAdmin = (): typeof admin => {
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(firePrivateConfig),
            });
        } catch (error) {
            console.log('Initialization error', error.stack);
        }
    }
    return admin;
};
