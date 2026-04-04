
import { chunkArray } from '../utils/chunkArray';

const extractJsonFromString = (text) => {
    if (!text) return null;
    // Remove Markdown JSON code block if it exists
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        return jsonMatch[1]; // Extract the JSON part
    }
    // If there's no code block, try to find the first valid JSON-like structure
    const jsonStart = text.indexOf('['); // Assuming response should be an array
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
        return text.substring(jsonStart, jsonEnd + 1);
    }
    return null; // No valid JSON found
};

const defaultPrompt = ({ localeFrom, localeTo, texts })=>{
    console.log(">>>>>>>>>>>> JSON ",texts);
    console.log(">>>>>>>>>>>> FROM ",localeFrom);
    console.log(">>>>>>>>>>>> TO ",localeTo);
    
    return `Translate me the following array: ${JSON.stringify(texts)} in locale=${localeFrom} to locale ${localeTo}, respond me with the same array structure`;
};

export const openAIResolver = ({ apiKey, baseUrl, chunkLength = 100, model = 'gpt-4o', prompt = defaultPrompt })=>{
    return {
        key: 'openai',
        resolve: async ({ localeFrom, localeTo, req, texts })=>{
            const apiUrl = `${baseUrl || 'https://api.openai.com'}/v1/chat/completions`;
            try {
                const response = await Promise.all(chunkArray(texts, chunkLength).map((texts)=>{
                    
                    return fetch(apiUrl, {
                        body: JSON.stringify({
                            messages: [
                                {
                                    content: prompt({
                                        localeFrom,
                                        localeTo,
                                        texts
                                    }),
                                    role: 'user'
                                }
                            ],
                            model
                        }),
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        },
                        method: 'post'
                    }).then(async (res)=>{
                        const data = await res.json();


                        if (!res.ok) req.payload.logger.info({
                            message: 'An error occurred when trying to translate the data using OpenAI API',
                            openAIresponse: data
                        });
                        return {
                            data,
                            success: res.ok
                        };
                    });
                }));
                
                const translated = [];
                for (const { data, success } of response){
                    if (!success) return {
                        success: false
                    };
                    const content = data?.choices?.[0]?.message?.content;
                    if (!content) {
                        req.payload.logger.error('An error occurred when trying to translate the data using OpenAI API - missing content in the response');
                        return {
                            success: false
                        };
                    }
                    // const translatedChunk = JSON.parse(content);

                    const cleanContent = extractJsonFromString(content);

if (!cleanContent) {
    req.payload.logger.error({
        fullContent: content,
        message: 'An error occurred when trying to translate the data using OpenAI API - unable to extract valid JSON'
    });
    return { success: false };
}

const translatedChunk = JSON.parse(cleanContent);



                    if (!Array.isArray(translatedChunk)) {
                        req.payload.logger.error({
                            data: translatedChunk,
                            fullContent: content,
                            message: 'An error occurred when trying to translate the data using OpenAI API - parsed content is not an array'
                        });
                        return {
                            success: false
                        };
                    }
                    for (const text of translatedChunk){
                        if (text && typeof text !== 'string') {
                            req.payload.logger.error({
                                chunkData: translatedChunk,
                                data: text,
                                fullContent: content,
                                message: 'An error occurred when trying to translate the data using OpenAI API - parsed content is not a string'
                            });
                            return {
                                success: false
                            };
                        }
                        translated.push(text);
                    }
                }
                console.log(">>>>>>>>>>>> TRANSLATED ",translated);
                return {
                    success: true,
                    translatedTexts: translated
                };
            } catch (e) {
                if (e instanceof Error) {
                    req.payload.logger.info({
                        message: 'An error occurred when trying to translate the data using OpenAI API - Last Error Msg',
                        originalErr: e.message
                    });
                }
                return {
                    success: false
                };
            }
        }
    };
};
// //# sourceMappingURL=openAI.js.map








// import { chunkArray } from '../utils/chunkArray';
// const defaultPrompt = ({ localeFrom, localeTo, texts })=>{
//     console.log(">>>>>>>>>>>> JSON ",texts);
//     return `Context: You are an expert in Auschwitz tours, specializing in translating texts related to visiting the Auschwitz Memorial. Your task is to translate texts **precisely**, while preserving specific formatting rules.

// STRICT RULES:
// 1. **Preserve leading and trailing whitespace** exactly as in the source text.
//    - If the source text contains spaces before or after words, the translation must **match this spacing exactly**.
//    - Do not remove or add extra spaces.
   
//    **Example:**
//    - Source (EN): " This is a ", "sample", " sentence."
//    - Translated (PL): " To jest ", "przykładowe", " zdanie."

// 2. **Preserve capitalization exactly as in the source.**
//    - If a word is capitalized in the source text, the translation **must** maintain this capitalization.
//    - If the first letter of a word is uppercase, ensure it remains uppercase in the translated sentence.

//    **Example:**
//    - Source (EN): "This is a Sample sentence."
//    - Translated (ES): "Esto es una Oración de ejemplo."
//    - The word "Sample" remains capitalized as "Oración."

// 3. **Contextual Translation:**
//    - Ensure words are translated in context, maintaining the correct meaning within the full sentence.
//    - Do not translate words in isolation.

// 4. **DO NOT modify punctuation or word order unless required for grammatical correctness in the target language.**
    
//     Translate me the following array: ${JSON.stringify(texts)} in locale=${localeFrom} to locale ${localeTo}, respond me with the same array structure.
//     Ensure that the translated text follows all the above rules strictly.
//     `;};
// export const openAIResolver = ({ apiKey, baseUrl, chunkLength = 100, model = 'gpt-3.5-turbo', prompt = defaultPrompt })=>{
//     return {
//         key: 'openai',
//         resolve: async ({ localeFrom, localeTo, req, texts })=>{
//             const apiUrl = `${baseUrl || 'https://api.openai.com'}/v1/chat/completions`;
//             try {
//                 const response = await Promise.all(chunkArray(texts, chunkLength).map((texts)=>{
//                     return fetch(apiUrl, {
//                         body: JSON.stringify({
//                             messages: [
//                                 {
//                                     content: prompt({
//                                         localeFrom,
//                                         localeTo,
//                                         texts
//                                     }),
//                                     role: 'user'
//                                 }
//                             ],
//                             model
//                         }),
//                         headers: {
//                             Authorization: `Bearer ${apiKey}`,
//                             'Content-Type': 'application/json'
//                         },
//                         method: 'post'
//                     }).then(async (res)=>{
//                         const data = await res.json();
//                         if (!res.ok) req.payload.logger.info({
//                             message: 'An error occurred when trying to translate the data using OpenAI API',
//                             openAIresponse: data
//                         });
//                         return {
//                             data,
//                             success: res.ok
//                         };
//                     });
//                 }));
//                 const translated = [];
//                 for (const { data, success } of response){
//                     if (!success) return {
//                         success: false
//                     };
//                     const content = data?.choices?.[0]?.message?.content;
//                     if (!content) {
//                         req.payload.logger.error('An error occurred when trying to translate the data using OpenAI API - missing content in the response');
//                         return {
//                             success: false
//                         };
//                     }
//                     const translatedChunk = JSON.parse(content);
//                     if (!Array.isArray(translatedChunk)) {
//                         req.payload.logger.error({
//                             data: translatedChunk,
//                             fullContent: content,
//                             message: 'An error occurred when trying to translate the data using OpenAI API - parsed content is not an array'
//                         });
//                         return {
//                             success: false
//                         };
//                     }
//                     for (const text of translatedChunk){
//                         if (text && typeof text !== 'string') {
//                             req.payload.logger.error({
//                                 chunkData: translatedChunk,
//                                 data: text,
//                                 fullContent: content,
//                                 message: 'An error occurred when trying to translate the data using OpenAI API - parsed content is not a string'
//                             });
//                             return {
//                                 success: false
//                             };
//                         }
//                         translated.push(text);
//                     }
//                 }
//                 return {
//                     success: true,
//                     translatedTexts: translated
//                 };
//             } catch (e) {
//                 if (e instanceof Error) {
//                     req.payload.logger.info({
//                         message: 'An error occurred when trying to translate the data using OpenAI API',
//                         originalErr: e.message
//                     });
//                 }
//                 return {
//                     success: false
//                 };
//             }
//         }
//     };
// };


