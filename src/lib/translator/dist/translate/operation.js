import he from 'he';
import { APIError } from 'payload';
import { findEntityWithConfig } from './findEntityWithConfig';
import { traverseFields } from './traverseFields';
import { updateEntity } from './updateEntity';
export const translateOperation = async (args)=>{
    const req = 'req' in args ? args.req : {
        payload: args.payload
    };
    const { collectionSlug, globalSlug, id, locale, localeFrom, overrideAccess } = args;
    const { config, doc: dataFrom } = await findEntityWithConfig({
        collectionSlug,
        globalSlug,
        id,
        locale: localeFrom,
        req
    });
    const resolver = (req.payload.config.custom?.translator?.resolvers ?? []).find((each)=>each.key === args.resolver);
    if (!resolver) throw new APIError(`Resolver with the key ${args.resolver} was not found`);
    const valuesToTranslate = [];
    let translatedData = args.data;
    if (!translatedData) {
        const { doc } = await findEntityWithConfig({
            collectionSlug,
            globalSlug,
            id,
            locale,
            overrideAccess,
            req
        });
        translatedData = doc;
    }
    traverseFields({
        dataFrom,
        emptyOnly: args.emptyOnly,
        fields: config.fields,
        translatedData,
        valuesToTranslate
    });
    const resolveResult = await resolver.resolve({
        localeFrom: args.localeFrom,
        localeTo: args.locale,
        req,
        texts: valuesToTranslate.map((each)=>each.value)
    });
    let result;
    if (!resolveResult.success) {
        result = {
            success: false
        };
    } else {
        resolveResult.translatedTexts.forEach((translated, index)=>{
            const formattedValue = he.decode(translated);
            if (valuesToTranslate[index] && valuesToTranslate[index].onTranslate) {
                valuesToTranslate[index].onTranslate(formattedValue);
            }
            
        });
        if (args.update) {
            await updateEntity({
                collectionSlug,
                data: translatedData,
                depth: 0,
                globalSlug,
                id,
                locale,
                overrideAccess,
                req
            });
        }
        result = {
            success: true,
            translatedData
        };
    }
    return result;
};

//# sourceMappingURL=operation.js.map
