import { z } from 'zod'

const optionalText = (max: number) => z.string().trim().max(max)
const httpUrl = z.union([
  z.literal(''),
  z.string().trim().url().max(500).refine(v => /^https?:\/\//i.test(v), 'HTTP(S) URL gerekli')
])
export const companySchema = z.object({
  brand_name: z.string().trim().min(1).max(160),
  legal_name: optionalText(160),
  tax_number: optionalText(70),
  registration_number: optionalText(70),
  phone: z.string().trim().min(3).max(60),
  whatsapp_phone: z.string().trim().min(3).max(60),
  contact_email: z.string().trim().email().max(160),
  location_label: z.string().trim().min(2).max(150),
  address: optionalText(250),
  opening_hours: optionalText(100),
  map_url: httpUrl,
  instagram_url: httpUrl,
  facebook_url: httpUrl,
  footer_description: optionalText(800)
})
export const companyKeys = Object.keys(companySchema.shape) as (keyof z.infer<typeof companySchema>)[]
export function parseCompanyForm(form: FormData) {
  return companySchema.safeParse(Object.fromEntries(companyKeys.map(key => [key, String(form.get(key) ?? '')])))
}

export const systemSlugs = ['ana-sayfa','hakkimizda','iletisim'] as const
export const pageSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(80),
  title: z.string().trim().min(1).max(160),
  intro: optionalText(700),
  body: optionalText(12000),
  published: z.boolean(),
  show_in_footer: z.boolean()
})
export function parseSitePage(form: FormData) {
  return pageSchema.safeParse({
    slug: form.get('slug'), title: form.get('title'),
    intro: form.get('intro'), body: form.get('body'),
    published: form.get('published') === 'on',
    show_in_footer: form.get('show_in_footer') === 'on'
  })
}
