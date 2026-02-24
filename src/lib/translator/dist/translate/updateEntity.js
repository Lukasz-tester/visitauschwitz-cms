import { APIError } from 'payload';
export const updateEntity = ({ collectionSlug, data, depth: incomingDepth, globalSlug, id, locale, overrideAccess, req })=>{
    if (!collectionSlug && !globalSlug) throw new APIError('Bad Request', 400);
    const isGlobal = !!globalSlug;
    if (!isGlobal && !id) throw new APIError('Bad Request', 400);
    const depth = incomingDepth ?? req.payload.config.defaultDepth;
    const promise = isGlobal ? req.payload.updateGlobal({
        data,
        depth,
        locale: locale,
        overrideAccess,
        req,
        slug: globalSlug
    }) : req.payload.update({
        collection: collectionSlug,
        data,
        depth,
        id: id,
        locale: locale,
        overrideAccess,
        req
    });
    return promise;
};

//# sourceMappingURL=updateEntity.js.map