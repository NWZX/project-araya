import { ORSInputOptimization, ORSOutputOptimization } from 'interfaces/ors';
import { fetchPostJSON } from 'utils/apiHelpers';

const OrsHost = process.env.ORS_HOST && process.env.ORS_HOST;
export default class ORSOptimization {
    static async get(obj: ORSInputOptimization): Promise<ORSOutputOptimization | undefined> {
        try {
            if (!OrsHost) {
                throw new Error('No Host in config');
            }
            return fetchPostJSON<ORSInputOptimization, ORSOutputOptimization>(OrsHost, obj);
        } catch (error) {
            return undefined;
        }
    }
}
