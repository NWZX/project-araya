import { NextApiResponse, NextApiRequest } from 'next';
import { ICustomer, IStore } from '../../../interfaces';
import { getFirebaseAdmin } from '../../../utils/db';
import { validate } from 'class-validator';
import getAlgolia from '../../../utils/getAlgolia';
import getAuthUser from '../../../utils/getAuthUser';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    } else {
        try {
            const db = getFirebaseAdmin();
            const user = await getAuthUser(req);
            //Check data validity
            const storeData = req.body.store as IStore;
            const error = await validate(storeData);
            if (error.length > 0) {
                throw new Error('Invalid customer data');
            }

            //Check if auth
            if (!user || !user.id) {
                throw new Error('Invalid token');
            }

            //Get user Data
            const customer = (
                await db
                    .firestore()
                    .doc('customers/' + user.id)
                    .get()
            ).data() as ICustomer;

            //Ecrase owner data with previously enter customer private data
            storeData.private.owner.firstName = customer.firstName;
            storeData.private.owner.lastName = customer.private.lastName;
            storeData.private.owner.address = customer.private.invoiceAddress;
            storeData.private.owner.contact = customer.private.contact;

            //Create new store in firestore
            await db.firestore().collection('stores').doc(user.id).set(storeData);

            const storeIndex = getAlgolia('stores');
            storeIndex?.saveObject({
                objectID: user.id,
                title: storeData.title,
                address: storeData.address,
                imageURL: storeData.imageMobileUrl,
            });

            res.status(200).json({
                result: true,
            }); //Good
        } catch (e) {
            res.status(500).json({ result: false }); //Bad
        }
    }
};

export default handler;
