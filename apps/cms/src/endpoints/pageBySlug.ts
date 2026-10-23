import type { Endpoint } from 'payload'
import type { ApiErrorBody, Page } from '@landing/types'

const json = (body: Page | ApiErrorBody, status = 200) => Response.json(body, { status })

/** GET /api/pages/by-slug/:slug -> сторінка або {error} з кодом 400/404/500 */
export const pageBySlug: Endpoint = {
  path: '/by-slug/:slug',
  method: 'get',
  handler: async (req) => {
    const slug = req.routeParams?.slug
    if (typeof slug !== 'string') return json({ error: 'Slug не вказано' }, 400)
    try {
      const { docs } = await req.payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        depth: 1,
        limit: 1,
      })
      if (!docs[0]) return json({ error: `Сторінку «${slug}» не знайдено` }, 404)
      return json(docs[0] as unknown as Page)
    } catch (e) {
      req.payload.logger.error(e)
      return json({ error: 'Внутрішня помилка сервера' }, 500)
    }
  },
}
