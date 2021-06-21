import { NextApiResponse, NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { EUsersRank, ICustomer } from 'interfaces';
import { getFirebaseAdmin } from 'utils/db';
import { validate } from 'class-validator';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    } else {
        try {
            const db = getFirebaseAdmin();
            //Check data validity
            const customerData = req.body.customer as ICustomer;
            const error = await validate(customerData);
            if (error.length > 0) {
                throw new Error('Invalid customer data');
            }

            //Check password validity
            const password = req.body.password as string;
            const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/\\~_+\-=|]).{8,32}$/i;
            if (!passwordRegex.test(password)) {
                throw new Error('Invalid password');
            }

            //Get hostname
            const origin = process.env.VERCEL_URL as string;

            //Create new firebase user
            const customer = await db.auth().createUser({
                email: customerData.private.contact.email,
                password,
                displayName: `${customerData.firstName} ${customerData.private.lastName}`,
                phoneNumber: customerData.private.contact.phone,
                emailVerified: false,
            });

            //Set user access right
            await db.auth().setCustomUserClaims(customer.uid, { admin: false, accessLevel: EUsersRank.Customer });

            //Create new customer in firestore
            await db.firestore().collection('customers').doc(customer.uid).set(customerData);

            //Generate & Send email validation
            const sign = jwt.sign(
                { id: customer.uid, email: customerData.private.contact.email, type: 'email_check' },
                process.env.JWT_SECRET || 'THUMB4444',
                {
                    expiresIn: '1d',
                },
            );

            const token = await db.auth().createCustomToken(customer.uid);

            res.status(200).json({
                result: true,
                token: token,
                url: `http://${origin}/api/auth/accountCheck?d=${sign}`,
            }); //Good
        } catch (e) {
            console.log(e.message);
            res.status(500).json({ result: false }); //Bad
        }
    }
};

export default handler;
