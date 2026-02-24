import { APIError } from 'payload';
import { translateOperation } from './operation';
export const translateEndpoint = async (req)=>{
    if (!req.json) throw new APIError('Content-Type should be json');
    const args = await req.json();
    const { collectionSlug, data, emptyOnly, globalSlug, id, locale, localeFrom, resolver } = args;
    const result = await translateOperation({
        collectionSlug,
        data,
        emptyOnly,
        globalSlug,
        id,
        locale,
        localeFrom,
        overrideAccess: false,
        req,
        resolver,
        update: false
    });
    return Response.json(result);
};

//# sourceMappingURL=endpoint.js.map