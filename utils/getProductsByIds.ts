import { getFirebaseAdmin } from './db';
import Stripe from 'stripe';
import { IProduct } from '../interfaces';
import { CartDetails } from 'use-shopping-cart';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2020-08-27',
});

//THAT MAY BE OPTIMISED. DIRTY

export const getProductsByIds = async (ids: string[]): Promise<IProduct[]> => {
    try {
        const db = getFirebaseAdmin();
        const raw: IProduct[] = [];
        for (let i = 0; i < ids.length; i = i + 10) {
            const chuck = ids.slice(i, i + 10);
            const result = await db
                .firestore()
                .collection('products')
                .where(db.firestore.FieldPath.documentId(), 'in', chuck)
                .get();
            result.forEach((t) => {
                const data = t.data() as IProduct; // Not complete
                const product: IProduct = { ...data, id: t.id, ref: t.ref }; // Complete
                raw.push(product);
            });
        }
        return raw;
    } catch (error) {
        throw new Error(error.message);
    }
};

export interface validateCartItemsReturn {
    validatedItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    totalToPayHT: number;
    totalToPayTTC: number;
}
export const validateCartItems = async (
    inventorySrc: IProduct[],
    cartDetails: CartDetails,
    currency: string,
): Promise<validateCartItemsReturn | undefined> => {
    try {
        const validatedItems = [];
        let total = 0;
        let totalTTC = 0;

        const taxData = await stripe.taxRates.list({ inclusive: false, active: true });
        const taxs = taxData.data.map((v) => {
            return { id: v.id, value: v.percentage };
        });

        for (const itemId in cartDetails) {
            const product = cartDetails[itemId];
            const inventoryItem = inventorySrc.find((currentProduct) => currentProduct.id === itemId.split(' ')[0]);

            if (!inventoryItem) throw new Error(`Product ${itemId} not found!`);

            if (product.option && product.option.length) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                const option = product.option as string[];
                const optionName: string[] = [];
                let raw = 0;
                inventoryItem.optionGroup.forEach((v) => {
                    v.option.forEach((w) => {
                        if (option.includes(w.id)) {
                            raw += w.price;
                            optionName.push(w.title);
                        }
                    });
                });

                const tax = taxs.find((v) => {
                    return v.value == inventoryItem.vat;
                });
                if (tax) {
                    total += (inventoryItem.price + raw) / (1 + tax?.value / 100);
                    totalTTC += inventoryItem.price + raw;
                    const item = {
                        price_data: {
                            currency: currency,
                            unit_amount: Math.round(
                                ((inventoryItem.price + raw) / (1 + tax?.value / 100)) * (1.15 + 0.15 * 0.2),
                            ), //App Fee
                            product_data: {
                                name: inventoryItem.title,
                                description: inventoryItem.description,
                                metadata: { option: JSON.stringify(optionName), id: inventoryItem.id },
                                // image: inventoryItem.
                            },
                        },
                        tax_rates: [tax.id],
                        quantity: product.quantity,
                    } as Stripe.Checkout.SessionCreateParams.LineItem;

                    validatedItems.push(item);
                }
            }

            return {
                validatedItems: validatedItems,
                totalToPayHT: Math.round(total),
                totalToPayTTC: Math.round(totalTTC),
            };
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
