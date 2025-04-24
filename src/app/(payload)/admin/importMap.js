import { RscEntryLexicalCell as RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField as RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { FixedToolbarFeatureClient as FixedToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient as UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient as BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { LinkFeatureClient as LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { OverviewComponent as OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaTitleComponent as MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaImageComponent as MetaImageComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaDescriptionComponent as MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { PreviewComponent as PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { SlugComponent as SlugComponent_92cc057d0a2abb4f6cf0307edf59f986 } from '@/fields/slug/SlugComponent'
import { CustomButtonWithTranslator as CustomButtonWithTranslator_0754f48e597a64286a6ec55277e0e245 } from '@payload-enchants/translator/client'
import { HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BlocksFeatureClient as BlocksFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { LinkToDoc as LinkToDoc_aead06e4cbf6b2620c5c51c9ab283634 } from '@payloadcms/plugin-search/client'
import { ReindexButton as ReindexButton_aead06e4cbf6b2620c5c51c9ab283634 } from '@payloadcms/plugin-search/client'
import { default as default_8a7ab0eb7ab5c511aba12e68480bfe5e } from '@/components/BeforeLogin'

import dynamic from 'next/dynamic'

export const importMap = {
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell': dynamic(() =>
    import('@payloadcms/richtext-lexical/rsc').then((mod) => mod.RscEntryLexicalCell),
  ),
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalField': dynamic(() =>
    import('@payloadcms/richtext-lexical/rsc').then((mod) => mod.RscEntryLexicalField),
  ),
  '@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient': dynamic(() =>
    import('@payloadcms/richtext-lexical/client').then((mod) => mod.InlineToolbarFeatureClient),
  ),
  '@payloadcms/richtext-lexical/client#FixedToolbarFeatureClient': dynamic(() =>
    import('@payloadcms/richtext-lexical/client').then((mod) => mod.FixedToolbarFeatureClient),
  ),
  '@payloadcms/richtext-lexical/client#HeadingFeatureClient': dynamic(() =>
    import('@payloadcms/richtext-lexical/client').then((mod) => mod.HeadingFeatureClient),
  ),
  '@payloadcms/richtext-lexical/client#UnderlineFeatureClient': dynamic(() =>
    import('@payloadcms/richtext-lexical/client').then((mod) => mod.UnderlineFeatureClient),
  ),
  '@payloadcms/richtext-lexical/client#BoldFeatureClient': dynamic(() =>
    import('@payloadcms/richtext-lexical/client').then((mod) => mod.BoldFeatureClient),
  ),
  '@payloadcms/richtext-lexical/client#ItalicFeatureClient': dynamic(() =>
    import('@payloadcms/richtext-lexical/client').then((mod) => mod.ItalicFeatureClient),
  ),
  '@payloadcms/richtext-lexical/client#LinkFeatureClient': dynamic(() =>
    import('@payloadcms/richtext-lexical/client').then((mod) => mod.LinkFeatureClient),
  ),
  '@payloadcms/plugin-seo/client#OverviewComponent': dynamic(() =>
    import('@payloadcms/plugin-seo/client').then((mod) => mod.OverviewComponent),
  ),
  '@payloadcms/plugin-seo/client#MetaTitleComponent': dynamic(() =>
    import('@payloadcms/plugin-seo/client').then((mod) => mod.MetaTitleComponent),
  ),
  '@payloadcms/plugin-seo/client#MetaImageComponent': dynamic(() =>
    import('@payloadcms/plugin-seo/client').then((mod) => mod.MetaImageComponent),
  ),
  '@payloadcms/plugin-seo/client#MetaDescriptionComponent': dynamic(() =>
    import('@payloadcms/plugin-seo/client').then((mod) => mod.MetaDescriptionComponent),
  ),
  '@payloadcms/plugin-seo/client#PreviewComponent': dynamic(() =>
    import('@payloadcms/plugin-seo/client').then((mod) => mod.PreviewComponent),
  ),
  '@/fields/slug/SlugComponent#SlugComponent': dynamic(() =>
    import('@/fields/slug/SlugComponent').then((mod) => mod.SlugComponent),
  ),
  '@payload-enchants/translator/client#CustomButtonWithTranslator': dynamic(() =>
    import('@payload-enchants/translator/client').then((mod) => mod.CustomButtonWithTranslator),
  ),
  '@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient': dynamic(() =>
    import('@payloadcms/richtext-lexical/client').then((mod) => mod.HorizontalRuleFeatureClient),
  ),
  '@payloadcms/richtext-lexical/client#BlocksFeatureClient': dynamic(() =>
    import('@payloadcms/richtext-lexical/client').then((mod) => mod.BlocksFeatureClient),
  ),
  '@payloadcms/plugin-search/client#LinkToDoc': dynamic(() =>
    import('@payloadcms/plugin-search/client').then((mod) => mod.LinkToDoc),
  ),
  '@payloadcms/plugin-search/client#ReindexButton': dynamic(() =>
    import('@payloadcms/plugin-search/client').then((mod) => mod.ReindexButton),
  ),
  '@/components/BeforeLogin#default': dynamic(() =>
    import('@/components/BeforeLogin').then((mod) => mod.default),
  ),
}

// BEFORE:
// export const importMap = {
//   "@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell": RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
//   "@payloadcms/richtext-lexical/rsc#RscEntryLexicalField": RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
//   "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
//   "@payloadcms/richtext-lexical/client#FixedToolbarFeatureClient": FixedToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
//   "@payloadcms/richtext-lexical/client#HeadingFeatureClient": HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
//   "@payloadcms/richtext-lexical/client#UnderlineFeatureClient": UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
//   "@payloadcms/richtext-lexical/client#BoldFeatureClient": BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
//   "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
//   "@payloadcms/richtext-lexical/client#LinkFeatureClient": LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
//   "@payloadcms/plugin-seo/client#OverviewComponent": OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
//   "@payloadcms/plugin-seo/client#MetaTitleComponent": MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860,
//   "@payloadcms/plugin-seo/client#MetaImageComponent": MetaImageComponent_a8a977ebc872c5d5ea7ee689724c0860,
//   "@payloadcms/plugin-seo/client#MetaDescriptionComponent": MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860,
//   "@payloadcms/plugin-seo/client#PreviewComponent": PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
//   "@/fields/slug/SlugComponent#SlugComponent": SlugComponent_92cc057d0a2abb4f6cf0307edf59f986,
//   "@payload-enchants/translator/client#CustomButtonWithTranslator": CustomButtonWithTranslator_0754f48e597a64286a6ec55277e0e245,
//   "@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient": HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
//   "@payloadcms/richtext-lexical/client#BlocksFeatureClient": BlocksFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
//   "@payloadcms/plugin-search/client#LinkToDoc": LinkToDoc_aead06e4cbf6b2620c5c51c9ab283634,
//   "@payloadcms/plugin-search/client#ReindexButton": ReindexButton_aead06e4cbf6b2620c5c51c9ab283634,
//   "@/components/BeforeLogin#default": default_8a7ab0eb7ab5c511aba12e68480bfe5e
// }
