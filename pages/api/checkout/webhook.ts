import Stripe from 'stripe';
import { NextApiResponse, NextApiRequest } from 'next';
import { getFirebaseAdmin } from 'utils/db';
import { buffer } from 'micro';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2020-08-27',
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const requestBuffer = await buffer(req);
            const sig = req.headers['stripe-signature'];

            if (!sig) {
                res.status(400).send(`Webhook Error: missing signature`);
                return;
            }
            if (!process.env.STRIPE_WEBHOOK_SECRET) {
                res.status(500).send(`Server Error: missing env`);
                return;
            }

            const event = stripe.webhooks.constructEvent(requestBuffer, sig, process.env.STRIPE_WEBHOOK_SECRET);

            // Handle the event
            if (event.type == 'payment_intent.succeeded') {
                const db = getFirebaseAdmin();
                const paymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent;
                const metadata = paymentIntent.metadata as { orderId: string };
                if (metadata && metadata.orderId) {
                    await db.firestore().doc(`orders/${metadata.orderId}`).set(
                        {
                            status: 2,
                            updatedAt: db.firestore.Timestamp.now().toMillis(),
                        },
                        { merge: true },
                    );
                }
            } else if (event.type == 'payment_intent.payment_failed' || event.type == 'payment_intent.canceled') {
                const db = getFirebaseAdmin();
                const paymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent;
                const metadata = paymentIntent.metadata as { orderId: string };
                if (metadata && metadata.orderId) {
                    await db.firestore().doc(`orders/${metadata.orderId}`).set(
                        {
                            status: 1,
                            updatedAt: db.firestore.Timestamp.now().toMillis(),
                        },
                        { merge: true },
                    );
                }
            } else {
                console.warn(`Unhandled event type ${event.type}`);
            }
            res.status(200).json({ received: true });
        } catch (error) {
            res.status(500).send('Server Error :' + error.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
