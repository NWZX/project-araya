/*                          WELCOME TO HELL
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */
import Stripe from 'stripe';
import { NextApiResponse, NextApiRequest } from 'next';
import { getProductsByIds, validateCartItems } from '../../../utils/getProductsByIds';
import { createOrder } from '../../../utils/createOrder';
import { EServiceType, IAddressGeo, ICustomer, IStore } from '../../../interfaces';
import getAuthUser from '../../../utils/getAuthUser';
import { getFirebaseAdmin } from '../../../utils/db';
import { CartDetails } from 'use-shopping-cart';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2020-08-27',
});

const CartDetailsToIds = (cartItem: CartDetails): string[] => {
    const ids: string[] = [];
    for (const itemId in cartItem) {
        if (!ids.includes(itemId.split(' ')[0])) {
            ids.push(itemId.split(' ')[0]);
        }
    }
    return ids;
};

type ReqBody = {
    storeId: string;
    cart: CartDetails;
    delivery: EServiceType;
    address?: IAddressGeo;
    detail?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        // Validate the cart details that were sent from the client.
        const { storeId, cart, delivery, address, detail } = req.body as ReqBody;

        //Check if user is Auth
        const user = await getAuthUser(req);
        if (!user?.firebaseUser || !user.id) {
            throw new Error('Error: Invalid token');
        }

        //Get products data
        const ids = CartDetailsToIds(cart);
        const produtsData = await getProductsByIds(ids);

        //Check validity of client cart
        const line_items = await validateCartItems(produtsData, cart, 'eur');
        if (!line_items) {
            throw new Error('Error: something goes wrong at the product validation');
        }

        //Get store Data
        const db = getFirebaseAdmin();
        const store = (
            await db
                .firestore()
                .doc('stores/' + storeId)
                .get()
        ).data() as IStore;
        if (!store.private.stripeId) {
            throw new Error('Error: no stripe account');
        }
        const account = await stripe.accounts.retrieve(store.private.stripeId);
        if (account.capabilities?.card_payments != 'active' || account.capabilities.transfers != 'active') {
            throw new Error('Error: stripe account incomplete');
        }

        //Get customer Data
        const customer = (
            await db
                .firestore()
                .doc('customers/' + user.id)
                .get()
        ).data() as ICustomer;

        //Include delivery fee
        if (delivery == EServiceType.Delivery) {
            if (store.deliveryFee)
                line_items.validatedItems.push({
                    quantity: 1,
                    price_data: {
                        currency: 'eur',
                        unit_amount: Math.round(store.deliveryFee), // No App Fee
                        product_data: {
                            name: 'Frais de livraison',
                            metadata: { id: '0000DLV' },
                            // image: inventoryItem.
                        },
                    },
                });
        }

        //Create order
        const orderId = await createOrder(line_items, user.firebaseUser, delivery, storeId, address, detail);
        if (!orderId) {
            throw new Error('Error: something goes wrong at the creation of orders');
        }

        //Get hostname
        const origin = process.env.VERCEL_URL as string;

        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
            submit_type: 'pay',
            payment_method_types: ['card'],
            customer: customer.private.stripeId,
            client_reference_id: user.id,
            mode: 'payment',
            payment_intent_data: {
                application_fee_amount: Math.round(line_items.totalToPayHT * (0.15 + 0.15 * 0.2)), //App Fee
                metadata: {
                    orderId: orderId,
                },
            },
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
            shipping_address_collection: undefined,
            line_items: line_items.validatedItems,
            success_url: `https://${origin}/order/finish/{CHECKOUT_SESSION_ID}`,
            cancel_url: `https://${origin}/order/finish`,
        };
        const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params, {
            stripeAccount: store.private.stripeId,
        });
        res.status(200).json(checkoutSession);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ statusCode: 500, message: err.message });
    }
}
