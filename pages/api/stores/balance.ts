import { NextApiRequest, NextApiResponse } from 'next';
import getAuthUser from 'utils/getAuthUser';
import { getFirebaseAdmin } from 'utils/db';
import Stripe from 'stripe';
import { IStore } from 'interfaces';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    typescript: true,
    apiVersion: '2020-08-27',
});

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const user = await getAuthUser(req);
        if (!user || !user.id) {
            throw new Error('Missing token');
        }
        const db = getFirebaseAdmin();
        let balance: Stripe.Response<Stripe.Balance> | undefined = undefined;
        if (user?.claims.admin) {
            balance = await stripe.balance.retrieve();
        } else if (((user?.claims.accessLevel as unknown) as number) == 2) {
            const store = (
                await db
                    .firestore()
                    .doc('customers/' + user.id)
                    .get()
            ).data() as IStore;
            balance = await stripe.balance.retrieve(undefined, { stripeAccount: store.private.stripeId });
        }
        res.status(200).json(balance);
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};

export default handler;
