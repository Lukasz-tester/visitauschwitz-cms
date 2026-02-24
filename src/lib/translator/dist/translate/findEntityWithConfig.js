import { APIError } from 'payload';
const findConfigBySlug = (slug, enities)=>enities.find((entity)=>entity.slug === slug);
export const findEntityWithConfig = async (args)=>{
    const { collectionSlug, globalSlug, id, locale, overrideAccess, req } = args;
    if (!collectionSlug && !globalSlug) throw new APIError('Bad Request', 400);
    const { payload } = req;
    const { config } = payload;
    const isGlobal = !!globalSlug;
    if (!isGlobal && !id) throw new APIError('Bad Request', 400);
    const entityConfig = isGlobal ? findConfigBySlug(globalSlug, config.globals) : findConfigBySlug(collectionSlug, config.collections);
    if (!entityConfig) throw new APIError('Bad Request', 400);
    const docPromise = isGlobal ? payload.findGlobal({
        depth: 0,
        fallbackLocale: undefined,
        locale: locale,
        overrideAccess,
        req,
        slug: args.globalSlug
    }) : payload.findByID({
        collection: collectionSlug,
        depth: 0,
        fallbackLocale: undefined,
        id: id,
        locale: locale,
        overrideAccess,
        req
    });
    return {
        config: entityConfig,
        doc: await docPromise
    };
};

//# sourceMappingURL=findEntityWithConfig.js.map