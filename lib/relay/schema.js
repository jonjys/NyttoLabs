import { z } from 'zod'

// Generic action model shared by every Nytto Labs application.
export const ACTION_TYPES = [
  'reorder',
  'replace',
  'verify',
  'export',
  'sign',
  'print',
  'send',
  'compare',
  'launch',
  'host',
  'register',
  'pay',
  'monitor',
  'route',
]

export const resolveInputSchema = z.object({
  app: z.string().min(1).max(64),
  action: z.string().min(1).max(32),
  country: z.string().min(2).max(2).optional().nullable(),
  language: z.string().min(2).max(5).optional().nullable(),
  category: z.string().max(120).optional().nullable(),
  query: z.string().max(240).optional().nullable(),
  brand: z.string().max(120).optional().nullable(),
  model: z.string().max(120).optional().nullable(),
  sku: z.string().max(120).optional().nullable(),
  source: z.string().max(120).optional().nullable(),
  // Anonymous, non-personal stable key used only for deterministic experiment allocation.
  experimentKey: z.string().max(120).optional().nullable(),
})

export const conversionSchema = z.object({
  click_id: z.string().min(6).max(80),
  // idempotency key: the same event id must never be counted twice.
  event_id: z.string().min(3).max(120),
  amount: z.number().nonnegative().optional().default(0),
  currency: z.string().min(3).max(3).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional().default('approved'),
  meta: z.record(z.any()).optional().default({}),
})

export const partnerInquirySchema = z.object({
  company: z.string().min(1).max(160),
  contactName: z.string().min(1).max(160),
  workEmail: z.string().email().max(200),
  website: z.string().max(200).optional().default(''),
  markets: z.string().max(200).optional().default(''),
  categories: z.string().max(200).optional().default(''),
  affiliateNetwork: z.string().max(160).optional().default(''),
  proposedPartnership: z.string().max(160).optional().default(''),
  message: z.string().max(4000).optional().default(''),
  consent: z.boolean().refine((v) => v === true, 'Consent is required'),
})

export const partnerSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  website: z.string().default(''),
  contactEmail: z.string().default(''),
  affiliateNetwork: z.string().default(''),
  relationshipType: z.string().default('affiliate'),
  supportedCountries: z.array(z.string()).default([]),
  supportedCurrencies: z.array(z.string()).default([]),
  approvedDomains: z.array(z.string()).default([]),
  reliabilityScore: z.number().min(0).max(100).default(50),
  active: z.boolean().default(true),
  notes: z.string().default(''),
  isDemo: z.boolean().default(false),
})

export const offerSchema = z.object({
  partnerSlug: z.string().min(1),
  name: z.string().min(1),
  destinationTemplate: z.string().min(1),
  supportedApplications: z.array(z.string()).default([]),
  supportedActions: z.array(z.string()).default([]),
  markets: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  brands: z.array(z.string()).default([]),
  commissionType: z.enum(['fixed', 'percentage', 'revshare', 'cpl', 'cpc', 'license', 'none']).default('percentage'),
  commissionAmount: z.number().default(0),
  currency: z.string().default('SEK'),
  priority: z.number().default(0),
  sponsored: z.boolean().default(false),
  disclosure: z.string().default(''),
  affiliateParams: z.record(z.string()).default({}),
  subIdParam: z.string().default(''),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  active: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  stats: z.object({
    clicks: z.number().default(0),
    conversions: z.number().default(0),
    conversionRate: z.number().default(0),
    rpcMinor: z.number().default(0),
    verified: z.boolean().default(false),
  }).default({ clicks: 0, conversions: 0, conversionRate: 0, rpcMinor: 0, verified: false }),
})
