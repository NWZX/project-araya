import { NextApiResponse, NextApiRequest } from 'next';
import { IProduct } from '../../../interfaces';
import { getFirebaseAdmin } from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (req.method !== 'GET') {
            res.setHeader('Allow', 'GET');
            res.status(405).end('Method Not Allowed');
        } else {
            const db = getFirebaseAdmin();

            const { pgid: productGroupId } = req.query as { pgid: string };
            const snapProducts = await db
                .firestore()
                .collection('products')
                .where('productGroupId', '==', productGroupId)
                .get();

            const dataProducts: IProduct[] = [];
            snapProducts.forEach((ticket) => {
                dataProducts.push({ ...(ticket.data() as IProduct), id: ticket.id, ref: ticket.ref });
            });
            res.status(200).json(dataProducts);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default handler;
