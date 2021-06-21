import { AuthUser } from 'next-firebase-auth';
import { EServiceType, IAddressGeo, IOrder } from 'interfaces';
import { getFirebaseAdmin } from './db';
import { validateCartItemsReturn } from './getProductsByIds';

export const createOrder = async (
    validatedData: validateCartItemsReturn,
    user: AuthUser,
    delivery: EServiceType,
    storeId: string,
    address?: IAddressGeo,
    detail?: string,
): Promise<string | undefined> => {
    const db = getFirebaseAdmin();
    try {
        const docUsers = await db.firestore().doc(`stores/${storeId}`).get();
        if (!docUsers.exists) {
            throw new Error('Invalid store Id');
        }
        const recipe = validatedData.validatedItems.map((v) => {
            return {
                id: v.price_data?.product_data?.metadata?.id,
                name: v.price_data?.product_data?.name,
                option:
                    typeof v.price_data?.product_data?.metadata?.option === 'string' &&
                    JSON.parse(v.price_data?.product_data?.metadata.option),
                qty: v.quantity,
                total: v.price_data?.unit_amount,
            };
        });
        const result = await db
            .firestore()
            .collection('orders')
            .add({
                storeId: storeId,
                customerId: user.id,
                client: { displayName: user.claims.name, address: address },
                recipe: { total: validatedData.totalToPayTTC, item: recipe },
                status: 0,
                detail: detail,
                deliveryMode: delivery,
                createdAt: db.firestore.Timestamp.now().toMillis(),
                updatedAt: db.firestore.Timestamp.now().toMillis(),
            } as Partial<IOrder>);
        return result.id;
    } catch (error) {
        console.error(error.message);
        return undefined;
    }
};
