import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateMarketingEmail } from '@/email/generateMarketingEmail'
import { getUnsubscribeUrl } from '@/lib/resend'
import type { MarketingCampaign } from '@/payload-types'

const MAX_BATCH_SIZE = 90

type SendFilter = {
  confirmed: 'confirmed' | 'unconfirmed' | 'all'
  locales: string[]
}

type RequestBody = {
  campaignId: string
  dryRun: boolean
  batchSize: number
  filter: SendFilter
}

export async function POST(request: NextRequest) {
  const payload = await getPayload({ config })

  // Auth — require admin session
  const { user } = await payload.auth({ headers: request.headers })
  const isAdmin = user && 'role' in user && (user.role === 'admin' || user.role == null)
  if (!isAdmin) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { campaignId, dryRun = false, batchSize, filter } = body

  if (!campaignId) return new Response('Missing campaignId', { status: 400 })
  if (!filter?.locales?.length) return new Response('No locales specified', { status: 400 })

  const safeBatchSize = Math.min(Math.max(1, batchSize || MAX_BATCH_SIZE), MAX_BATCH_SIZE)

  // Fetch campaign
  let campaign: MarketingCampaign
  try {
    campaign = await payload.findByID({ collection: 'marketing-campaigns', id: campaignId })
  } catch {
    return new Response('Campaign not found', { status: 404 })
  }

  // State guards
  if (campaign.status === 'completed') {
    return Response.json({ error: 'Campaign already completed. Duplicate it to resend.' }, { status: 400 })
  }
  if (campaign.status === 'sending') {
    return Response.json({ error: 'Send already in progress.' }, { status: 400 })
  }

  // Build subscriber query
  const where: Record<string, any> = {
    locale: { in: filter.locales },
  }
  if (filter.confirmed === 'confirmed') where.confirmed = { equals: true }
  if (filter.confirmed === 'unconfirmed') where.confirmed = { not_equals: true }

  const currentPage = campaign.currentPage ?? 1

  // Dry run — return recipient preview only
  if (dryRun) {
    const result = await payload.find({
      collection: 'subscribers',
      where,
      page: currentPage,
      limit: safeBatchSize,
      sort: 'createdAt',
    })
    const totalResult = await payload.find({
      collection: 'subscribers',
      where,
      limit: 0,
    })
    return Response.json({
      dryRun: true,
      recipients: result.docs.map((s) => ({ email: s.email, locale: s.locale, id: s.id })),
      page: currentPage,
      pageTotal: result.docs.length,
      total: totalResult.totalDocs,
    })
  }

  // Real send — mark as sending
  await payload.update({
    collection: 'marketing-campaigns',
    id: campaignId,
    data: {
      status: 'sending',
      startedAt: campaign.startedAt ?? new Date().toISOString(),
    },
  })

  const result = await payload.find({
    collection: 'subscribers',
    where,
    page: currentPage,
    limit: safeBatchSize,
    sort: 'createdAt',
  })

  let sent = 0
  let lastError: string | null = null

  for (const subscriber of result.docs) {
    try {
      // Fetch campaign content for subscriber's locale, fall back to 'en'
      const supportedLocales = ['en', 'pl'] as const
      const locale = supportedLocales.includes(subscriber.locale as any)
        ? (subscriber.locale as 'en' | 'pl')
        : 'en'

      const campaignContent = await payload.findByID({
        collection: 'marketing-campaigns',
        id: campaignId,
        locale,
      })

      if (!campaignContent.subject || !campaignContent.body) {
        payload.logger.warn({ subscriberId: subscriber.id, locale }, 'Campaign missing content for locale, skipping')
        continue
      }

      const unsubscribeUrl = getUnsubscribeUrl(subscriber.token!)
      const { subject, html } = generateMarketingEmail({
        locale: subscriber.locale,
        subject: campaignContent.subject,
        preheader: campaignContent.preheader,
        body: campaignContent.body,
        footer: campaignContent.footer,
        unsubscribeUrl,
      })

      await payload.sendEmail({
        to: subscriber.email,
        subject,
        html,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })

      sent++
    } catch (err: any) {
      const isRateLimit = err?.statusCode === 429 || err?.message?.includes('429')
      payload.logger.error({ err, email: subscriber.email }, 'Failed to send marketing email')
      lastError = isRateLimit ? 'Rate limit reached (429). Resume tomorrow.' : err?.message ?? 'Unknown error'
      break
    }
  }

  // Count remaining subscribers after this page
  const nextPageCheck = await payload.find({
    collection: 'subscribers',
    where,
    page: currentPage + 1,
    limit: 1,
    sort: 'createdAt',
  })
  const hasMore = nextPageCheck.totalDocs > currentPage * safeBatchSize

  const newStatus = lastError ? 'paused' : hasMore ? 'paused' : 'completed'
  const newSentCount = (campaign.sentCount ?? 0) + sent

  await payload.update({
    collection: 'marketing-campaigns',
    id: campaignId,
    data: {
      status: newStatus,
      sentCount: newSentCount,
      currentPage: lastError ? currentPage : currentPage + 1,
      ...(newStatus === 'completed' ? { completedAt: new Date().toISOString() } : {}),
    },
  })

  return Response.json({
    sent,
    sentTotal: newSentCount,
    remaining: nextPageCheck.totalDocs - newSentCount,
    status: newStatus,
    ...(lastError ? { error: lastError } : {}),
  })
}
