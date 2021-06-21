import { NextApiResponse, NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { getFirebaseAdmin } from 'utils/db';

import Stripe from 'stripe';
import { ICustomer } from 'interfaces';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2020-08-27',
});

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).end('Method Not Allowed');
    } else {
        try {
            const db = getFirebaseAdmin();
            const origin = process.env.VERCEL_URL as string;

            const data: string = req.query.d as string;
            const { id, email } = jwt.verify(data, process.env.JWT_SECRET || 'THUMB4444') as {
                id: string;
                email: string;
                type: string;
            };

            //Load customer
            const customerDoc = await db
                .firestore()
                .doc('customers/' + id)
                .get();
            const customer = customerDoc.data() as ICustomer;
            customer.id = customerDoc.id;
            customer.ref = customerDoc.ref;

            //Check if firebase auth is ok
            const user = await db.auth().getUser(id);
            if (user.email != email) {
                throw new Error('Invalid token');
            }

            //Update stripe
            if (customer.private.stripeId) {
                await stripe.customers.update(customer.private.stripeId, { email: email });
            }

            //Update cutomer
            await customer.ref?.set(
                {
                    private: { contact: { email: email } },
                } as Partial<ICustomer>,
                { merge: true },
            );

            res.redirect(`https://${origin}/account/profile`);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    }
};

export default handler;
