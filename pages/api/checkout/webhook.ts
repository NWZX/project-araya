import Stripe from 'stripe';
import { NextApiResponse, NextApiRequest } from 'next';
import { getFirebaseAdmin } from '../../../utils/db';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event | undefined = undefined;
    try {
        if (!sig) {
            return res.status(400).send(`Webhook Error: missing signature`);
        }
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            return res.status(500).send(`Server Error: missing env`);
        }

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        // Handle the event
        if (event.type == 'payment_intent.succeeded') {
            const db = getFirebaseAdmin();
            const paymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent;
            const metadata = paymentIntent.metadata as { orderId: string };
            if (metadata && metadata.orderId) {
                await db.firestore().doc(`orders/${metadata.orderId}`).set(
                    {
                        status: 2,
                        updatedAt: db.firestore.Timestamp.now(),
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
                        updatedAt: db.firestore.Timestamp.now(),
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
}
