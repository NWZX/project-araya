import { NextApiResponse, NextApiRequest } from 'next';
import { IProductGroup } from 'interfaces';
import { getFirebaseAdmin } from 'utils/db';
import { validate } from 'class-validator';
import getAuthUser from 'utils/getAuthUser';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    } else {
        try {
            const db = getFirebaseAdmin();
            const user = await getAuthUser(req);
            //Check data validity
            const groupData = req.body.group as IProductGroup;
            const error = await validate(groupData);
            if (error.length > 0) {
                throw new Error('Invalid group data');
            }

            //Check if auth
            if (!user || !user.id) {
                throw new Error('Invalid token');
            }

            //Ecrase owner data with previously enter customer private data
            if (groupData.id && groupData.storeId == user.id) {
                const products = await db
                    .firestore()
                    .collection('products')
                    .where('productGroupId', '==', groupData.id)
                    .get();
                products.forEach((r) => {
                    r.ref.delete();
                });

                await db
                    .firestore()
                    .doc('productGroups/' + groupData.id)
                    .delete();
            }

            res.status(200).json({
                result: true,
            }); //Good
        } catch (e) {
            res.status(500).json(e.message); //Bad
        }
    }
};

export default handler;
