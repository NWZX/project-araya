import { NextApiRequest } from 'next';
import { AuthUser, verifyIdToken } from 'next-firebase-auth';

const getAuthUser = (req: NextApiRequest): Promise<AuthUser> | undefined => {
    try {
        const b64Token = req.cookies['araya.AuthUserTokens'];
        if (b64Token) {
            const dirtToken = Buffer.from(b64Token, 'base64').toString();
            const token = JSON.parse(JSON.parse(dirtToken));
            return verifyIdToken(token.idToken);
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
};

export default getAuthUser;
