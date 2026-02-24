import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './styles.scss';
import { Modal } from '@payloadcms/ui';
import { useTranslator } from '../../providers/Translator/context';
import { Content } from './Content';
export const TranslatorModal = ()=>{
    const { closeTranslator, modalSlug, resolver } = useTranslator();
    if (!resolver) return;
    return /*#__PURE__*/ _jsx(Modal, {
        className: 'translator__modal',
        slug: modalSlug,
        children: /*#__PURE__*/ _jsxs("div", {
            className: 'translator__wrapper',
            children: [
                /*#__PURE__*/ _jsx("button", {
                    "aria-label": "Close",
                    className: 'translator__close',
                    onClick: closeTranslator
                }),
                /*#__PURE__*/ _jsx(Content, {})
            ]
        })
    });
};

//# sourceMappingURL=TranslatorModal.js.map