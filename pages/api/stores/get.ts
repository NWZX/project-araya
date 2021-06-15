import { NextApiResponse, NextApiRequest } from 'next';
import { IProductGroup, IStore } from '../../../interfaces';
import { getFirebaseAdmin } from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (req.method !== 'GET') {
            res.setHeader('Allow', 'GET');
            res.status(405).end('Method Not Allowed');
        } else {
            const db = getFirebaseAdmin().firestore();

            const { id } = req.query as { id: string };
            const snapStore = await db.collection('stores').doc(id).get();
            if (!snapStore.exists) {
                throw new Error('No matching event');
            }
            const dataStore = { ...(snapStore.data() as IStore), id: snapStore.id };

            const snapGroups = await db.collection('productGroups').where('storeId', '==', id).get();

            const dataGroups: IProductGroup[] = [];
            snapGroups.forEach((v) => dataGroups.push({ ...(v.data() as IProductGroup), id: v.id }));

            res.status(200).json({ dataStore, dataGroups });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default handler;
