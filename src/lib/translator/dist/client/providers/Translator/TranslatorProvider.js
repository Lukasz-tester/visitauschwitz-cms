import { jsx as _jsx } from "react/jsx-runtime";
import { toast, useAllFormFields, useConfig, useDocumentInfo, useForm, useLocale, useModal, useServerFunctions, useTranslation } from '@payloadcms/ui';
import { reduceFieldsToValues } from 'payload/shared';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '../../api';
import { TranslatorContext } from './context';
const modalSlug = 'translator-modal';
export const TranslatorProvider = ({ children })=>{
    const [resolver, setResolver] = useState(null);
    const [data, dispatch] = useAllFormFields();
    const { getFormState } = useServerFunctions();
    const { collectionSlug, getDocPreferences, globalSlug, id } = useDocumentInfo();
    const { setModified } = useForm();
    const modal = useModal();
    const { t } = useTranslation();
    const resolverT = (key)=>{
        if (!resolver) return '';
        return t(`plugin-translator:resolver_${resolver}_${key}`);
    };
    const locale = useLocale();
    const { config: { admin: { custom }, localization, routes: { api }, serverURL } } = useConfig();
    const apiClient = createClient({
        api,
        serverURL
    });
    const resolverConfig = useMemo(()=>{
        if (!resolver) return null;
        const resolvers = custom?.translator?.resolvers || undefined;
        if (!resolvers) return null;
        const resolverConfig = resolvers.find((each)=>each.key === resolver);
        return resolverConfig ?? null;
    }, [
        custom,
        resolver
    ]);
    if (!localization) throw new Error('Localization config is not provided and PluginTranslator is used');
    const localesOptions = localization.locales.filter((each)=>each.code !== locale.code);
    const [localeToTranslateFrom, setLocaleToTranslateFrom] = useState('');
    // useEffect(()=>{
    //     const defaultFromOptions = localesOptions.find((each)=>localization.defaultLocale === each.code);
    //     if (defaultFromOptions) setLocaleToTranslateFrom(defaultFromOptions.code);
    //     setLocaleToTranslateFrom(localesOptions[0].code);
    // }, [
    //     locale,
    //     localesOptions,
    //     localization.defaultLocale
    // ]);
    useEffect(() => {
        const defaultFromOptions = localesOptions.find((each) => localization.defaultLocale === each.code);
      
        if (defaultFromOptions) {
          setLocaleToTranslateFrom(defaultFromOptions.code);
        } else if (localesOptions.length > 0) {
          setLocaleToTranslateFrom(localesOptions[0].code);
        }
      }, [locale, localesOptions, localization.defaultLocale]);


    const closeTranslator = ()=>modal.closeModal(modalSlug);
    const submit = async ({ emptyOnly })=>{
        if (!resolver) return;
        const args = {
            collectionSlug,
            data: reduceFieldsToValues(data, true),
            emptyOnly,
            globalSlug,
            id: id === null ? undefined : id,
            locale: locale.code,
            localeFrom: localeToTranslateFrom,
            resolver
        };
        const result = await apiClient.translate(args);
        if (!result.success) {
            toast.error(resolverT('errorMessage'));
            return;
        }
        const { state } = await getFormState({
            collectionSlug,
            data: result.translatedData,
            docPermissions: {
                fields: true,
                update: true
            },
            docPreferences: await getDocPreferences(),
            globalSlug,
            locale: locale.code,
            operation: 'update',
            renderAllFields: true,
            schemaPath: collectionSlug || globalSlug || ''
        });
        if (state) {
            dispatch({
                state,
                type: 'REPLACE_STATE'
            });
            setModified(true);
            toast.success(resolverT('successMessage'));
        }
        closeTranslator();
    };
    return /*#__PURE__*/ _jsx(TranslatorContext.Provider, {
        value: {
            closeTranslator,
            localeToTranslateFrom,
            localesOptions,
            modalSlug,
            openTranslator: ({ resolverKey })=>{
                setResolver(resolverKey);
                modal.openModal(modalSlug);
            },
            resolver: resolverConfig,
            resolverT,
            setLocaleToTranslateFrom,
            submit
        },
        children: children
    });
};

//# sourceMappingURL=TranslatorProvider.js.map