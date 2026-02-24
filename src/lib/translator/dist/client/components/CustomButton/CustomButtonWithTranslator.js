'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './styles.scss';
import { PublishButton, SaveButton, useConfig, useDocumentInfo } from '@payloadcms/ui';
import { TranslatorProvider } from '../../providers/Translator/TranslatorProvider';
import { ResolverButton } from '../ResolverButton';
import { TranslatorModal } from '../TranslatorModal';
export const CustomButtonWithTranslator = ({ type })=>{
    const { config } = useConfig();
    const DefaultButton = type === 'publish' ? PublishButton : SaveButton;
    const { globalSlug, id } = useDocumentInfo();
    const resolvers = config.admin?.custom?.translator?.resolvers ?? [];
    if (!id && !globalSlug) return /*#__PURE__*/ _jsx(DefaultButton, {});
    return /*#__PURE__*/ _jsx(TranslatorProvider, {
        children: /*#__PURE__*/ _jsxs("div", {
            className: 'translator__custom-save-button',
            children: [
                /*#__PURE__*/ _jsx(TranslatorModal, {}),
                resolvers.map((resolver)=>/*#__PURE__*/ _jsx(ResolverButton, {
                        resolver: resolver
                    }, resolver.key)),
                /*#__PURE__*/ _jsx(DefaultButton, {})
            ]
        })
    });
};

//# sourceMappingURL=CustomButtonWithTranslator.js.map