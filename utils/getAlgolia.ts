import algoliasearch, { SearchIndex } from 'algoliasearch';
const client =
    process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_KEY
        ? algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY)
        : undefined;

const getAlgolia = (index: string): SearchIndex | undefined => {
    try {
        return client?.initIndex(index);
    } catch (error) {
        return undefined;
    }
};

export default getAlgolia;
