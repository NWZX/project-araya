import { NextApiRequest, NextApiResponse } from 'next';
import faker from 'faker';
import firebase from 'firebase-admin';
import { IStore } from '../../../interfaces';
import getAlgolia from '../../../utils/getAlgolia';
import { getFirebaseAdmin } from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        faker.locale = 'fr';
        const storeIndex = getAlgolia('stores');
        if (!storeIndex) {
            throw new Error('ALGO ZERO');
        }
        const db = getFirebaseAdmin();

        const data: IStore[] = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                title: faker.company.companyName(),
                address: {
                    street: faker.address.streetAddress(),
                    zipcode: faker.address.zipCode(),
                    city: faker.address.city(),
                    country: 'MQ',
                    geolocation: new firebase.firestore.GeoPoint(
                        parseFloat(faker.address.latitude(14.9, 14.385)),
                        parseFloat(faker.address.longitude(-60.787, -61.247)),
                    ),
                },
                contact: { email: faker.internet.email(), phone: faker.phone.phoneNumber() },
                minToOrder: faker.datatype.number({ min: 10, max: 20 }),
                serviceType: {
                    isDelivery: faker.datatype.boolean(),
                    isTakeAway: faker.datatype.boolean(),
                },
                tags: faker.random.arrayElements([
                    '6qKAT0RdX2HPRXOLixWP',
                    '87Ai3NY1E5pBWFXI5LXm',
                    '9IA5Gsrd6GynKufS6s8l',
                    'B5fBwphunUXpX1FELWNT',
                    'FMYXJNUPvsWLTeMgbJTP',
                    'uuOASKKmJKVJo2WdeRT3',
                    'wvqtJgD6kWuz7TRiZlvj',
                ]),
                private: {
                    owner: {
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName(),
                        address: {
                            street: faker.address.streetAddress(),
                            zipcode: faker.address.zipCode(),
                            city: faker.address.city(),
                            country: 'MQ',
                        },
                        contact: { email: faker.internet.email(), phone: faker.phone.phoneNumber() },
                    },
                    stripeId: 'acct_1IRQDZQrKiDPKPZj',
                },
                createdAt: firebase.firestore.Timestamp.now(),
            });
            const store = await db.firestore().collection('stores').add(data[i]);

            await storeIndex?.saveObject({
                objectID: store.id,
                id: store.id,
                title: data[i].title,
                address: data[i].address,
                tags: data[i].tags,
                minToOrder: data[i].minToOrder,
                serviceType: data[i].serviceType,
                contact: data[i].contact,
                imageUrl: data[i].imageUrl,
                imageMobileUrl: data[i].imageMobileUrl,
            });
        }

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};

export default handler;
