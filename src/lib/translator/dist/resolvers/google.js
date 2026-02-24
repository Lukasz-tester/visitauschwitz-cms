import { chunkArray } from '../utils/chunkArray';
const localeToCountryCodeMapper = {
    ua: 'uk'
};
const mapLocale = (incoming)=>incoming in localeToCountryCodeMapper ? localeToCountryCodeMapper[incoming] : incoming;
export const googleResolver = ({ apiKey, chunkLength = 100 })=>{
    return {
        key: 'google',
        resolve: async (args)=>{
            const { localeFrom, localeTo, req, texts } = args;
            const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
            const responses = await Promise.all(chunkArray(texts, chunkLength).map((q)=>fetch(apiUrl, {
                    body: JSON.stringify({
                        q,
                        source: mapLocale(localeFrom),
                        target: mapLocale(localeTo)
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }).then(async (res)=>{
                    const data = await res.json();
                    if (!res.ok) req.payload.logger.info({
                        googleResponse: data,
                        message: 'An error occurred when trying to translate the data using Google API'
                    });
                    return {
                        data,
                        success: res.ok
                    };
                })));
            if (responses.some((res)=>!res.success)) {
                return {
                    success: false
                };
            }
            const translatedTexts = responses.flatMap((chunk)=>chunk.data.data.translations).map((translation)=>translation.translatedText);
            return {
                success: true,
                translatedTexts
            };
        }
    };
};

//# sourceMappingURL=google.js.map