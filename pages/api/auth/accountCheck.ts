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
            const customerDoc = await db
                .firestore()
                .doc('customers/' + id)
                .get();
            const customer = customerDoc.data() as ICustomer;
            customer.id = customerDoc.id;
            customer.ref = customerDoc.ref;

            const address = customer.private.invoiceAddress;

            if (email != customer.private.contact.email) {
                throw new Error('Unexpected Error.');
            }

            const customerStripe = await stripe.customers.create({
                email: email,
                phone: customer.private.contact.phone,
                name: `${customer.firstName} ${customer.private.lastName}`,
                preferred_locales: ['FR', 'EN'],
                address: {
                    line1: address.street,
                    line2: address.optional,
                    postal_code: address.zipcode,
                    city: address.city,
                    country: address.country,
                },
            });

            await customer.ref?.set(
                {
                    private: { stripeId: customerStripe.id },
                },
                { merge: true },
            );

            res.redirect(`https://${origin}/`);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    }
};

export default handler;
