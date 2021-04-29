import { NextApiResponse, NextApiRequest } from 'next';
import { unsetAuthCookies } from 'next-firebase-auth';
import initAuth from '../../../utils/initAuth'; // the module you created above

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        await unsetAuthCookies(req, res);
    } catch (e) {
        res.status(500).json({ error: 'Unexpected error.' });
    }
    res.status(200).json({ success: true });
};

export default handler;
