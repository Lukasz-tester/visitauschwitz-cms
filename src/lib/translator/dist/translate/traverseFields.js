import ObjectID from 'bson-objectid';
import { tabHasName } from 'payload/shared';
import { isEmpty } from '../utils/isEmpty';
import { traverseRichText } from './traverseRichText';
export const traverseFields = ({ dataFrom, emptyOnly, fields, localizedParent, siblingDataFrom, siblingDataTranslated, translatedData, valuesToTranslate })=>{
    siblingDataFrom = siblingDataFrom ?? dataFrom;
    siblingDataTranslated = siblingDataTranslated ?? translatedData;
    for (const field of fields){
        switch(field.type){
            case 'tabs':
                for (const tab of field.tabs){
                    const hasName = tabHasName(tab);
                    const tabDataFrom = hasName ? siblingDataFrom[tab.name] : siblingDataFrom;
                    if (!tabDataFrom) return;
                    const tabDataTranslated = hasName ? siblingDataTranslated[tab.name] ?? {} : siblingDataTranslated;
                    traverseFields({
                        dataFrom,
                        emptyOnly,
                        fields: tab.fields,
                        localizedParent: tab.localized,
                        siblingDataFrom: tabDataFrom,
                        siblingDataTranslated: tabDataTranslated,
                        translatedData,
                        valuesToTranslate
                    });
                }
                break;
            case 'group':
                {
                    const groupDataFrom = siblingDataFrom[field.name];
                    if (!groupDataFrom) break;
                    const groupDataTranslated = siblingDataTranslated[field.name] ?? {};
                    traverseFields({
                        dataFrom,
                        emptyOnly,
                        fields: field.fields,
                        localizedParent: field.localized,
                        siblingDataFrom: groupDataFrom,
                        siblingDataTranslated: groupDataTranslated,
                        translatedData,
                        valuesToTranslate
                    });
                    break;
                }
            case 'array':
                {
                    const arrayDataFrom = siblingDataFrom[field.name];
                    if (isEmpty(arrayDataFrom)) break;
                    let arrayDataTranslated = siblingDataTranslated[field.name] ?? [];
                    if (field.localized || localizedParent) {
                        if (arrayDataTranslated.length > 0 && emptyOnly) break;
                        arrayDataTranslated = arrayDataFrom.map(()=>({
                                id: ObjectID().toHexString()
                            }));
                    }
                    arrayDataTranslated.forEach((item, index)=>{
                        traverseFields({
                            dataFrom,
                            emptyOnly,
                            fields: field.fields,
                            localizedParent: localizedParent ?? field.localized,
                            siblingDataFrom: arrayDataFrom[index],
                            siblingDataTranslated: item,
                            translatedData,
                            valuesToTranslate
                        });
                    });
                    siblingDataTranslated[field.name] = arrayDataTranslated;
                    break;
                }
            case 'blocks':
                {
                    const blocksDataFrom = siblingDataFrom[field.name];
                    if (isEmpty(blocksDataFrom)) break;
                    let blocksDataTranslated = siblingDataTranslated[field.name] ?? [];
                    if (field.localized || localizedParent) {
                        if (blocksDataTranslated.length > 0 && emptyOnly) break;
                        blocksDataTranslated = blocksDataFrom.map(({ blockType })=>({
                                blockType,
                                id: ObjectID().toHexString()
                            }));
                    }
                    blocksDataTranslated.forEach((item, index)=>{
                        const block = field.blocks.find((each)=>each.slug === item.blockType);
                        if (!block) return;
                        traverseFields({
                            dataFrom,
                            emptyOnly,
                            fields: block.fields,
                            localizedParent: localizedParent ?? field.localized,
                            siblingDataFrom: blocksDataFrom[index],
                            siblingDataTranslated: item,
                            translatedData,
                            valuesToTranslate
                        });
                    });
                    siblingDataTranslated[field.name] = blocksDataTranslated;
                    break;
                }
            case 'collapsible':
            case 'row':
                traverseFields({
                    dataFrom,
                    emptyOnly,
                    fields: field.fields,
                    localizedParent,
                    siblingDataFrom,
                    siblingDataTranslated,
                    translatedData,
                    valuesToTranslate
                });
                break;
            // long ass cases here we have
            case 'date':
            case 'checkbox':
            case 'json':
            case 'code':
            case 'email':
            case 'number':
            case 'point':
            case 'radio':
            case 'relationship':
            case 'select':
            case 'upload':
                siblingDataTranslated[field.name] = siblingDataFrom[field.name];
                break;
            case 'text':
            case 'textarea':
                if (field.custom && typeof field.custom === 'object' && field.custom.translatorSkip) break;
                if (!(field.localized || localizedParent) || isEmpty(siblingDataFrom[field.name])) break;
                if (emptyOnly && siblingDataTranslated[field.name]) break;
                // do not translate the block ID or admin-facing label
                if (field.name === 'blockName' || field.name === 'id' || field.name === 'slug') {
                    break;
                }
                valuesToTranslate.push({
                    onTranslate: (translated)=>{
                        siblingDataTranslated[field.name] = translated;
                    },
                    value: siblingDataFrom[field.name],
                    fieldName: field.name
                });
                break;
            case 'richText':
                {
                    if (!(field.localized || localizedParent) || isEmpty(siblingDataFrom[field.name])) break;
                    if (emptyOnly && siblingDataTranslated[field.name]) break;
                    const richTextDataFrom = siblingDataFrom[field.name];
                    siblingDataTranslated[field.name] = richTextDataFrom;
                    if (!richTextDataFrom) break;
                    const isSlate = Array.isArray(richTextDataFrom);
                    const isLexical = 'root' in richTextDataFrom;
                    if (!isSlate && !isLexical) break;
                    if (isLexical) {
                        const root = siblingDataTranslated[field.name]?.root;
                        if (root) traverseRichText({
                            onText: (siblingData)=>{
                                valuesToTranslate.push({
                                    onTranslate: (translated)=>{
                                        siblingData.text = translated;
                                    },
                                    value: siblingData.text,
                                    fieldName: 'richText'
                                });
                            },
                            root
                        });
                    } else {
                        for (const root of siblingDataTranslated[field.name]){
                            traverseRichText({
                                onText: (siblingData)=>{
                                    valuesToTranslate.push({
                                        onTranslate: (translated)=>{
                                            siblingData.text = translated;
                                        },
                                        value: siblingData.text,
                                        fieldName: 'richText'
                                    });
                                },
                                root: root
                            });
                        }
                    }
                    break;
                }
            default:
                break;
        }
    }
};

//# sourceMappingURL=traverseFields.js.map