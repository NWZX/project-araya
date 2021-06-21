import { NextApiResponse, NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import getAuthUser from 'utils/getAuthUser';

type ReqBody = {
    newEmail: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    } else {
        try {
            const { newEmail } = req.body as ReqBody;
            //Get hostname
            const origin = process.env.VERCEL_URL as string;

            //Check if user is Auth
            const user = await getAuthUser(req);
            if (!user?.id) {
                throw new Error('Error: Invalid token');
            }

            //Generate & Send email validation
            const sign = jwt.sign(
                { id: user.id, email: newEmail, type: 'email_update' },
                process.env.JWT_SECRET || 'THUMB4444',
                {
                    expiresIn: '1d',
                },
            );

            res.status(200).json({
                result: true,
                url: `https://${origin}/api/account/updateEmail?d=${sign}`,
            }); //Good
        } catch (e) {
            console.error(e.message);
            res.status(500).json({ result: false }); //Bad
        }
    }
};

export default handler;
