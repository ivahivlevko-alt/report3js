import type { ApiErrorBody, Page, PageBlock, BlockType } from '@landing/types'

const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const BLOCK_TYPES: readonly BlockType[] = ['hero', 'features', 'steps', 'faq']

/** Помилка API з HTTP-кодом (0 = мережа недоступна). */
export class ApiError extends Error {
  constructor(message: string, readonly code: number) {
    super(message)
  }
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

const isBlock = (v: unknown): v is PageBlock =>
  isObject(v) && BLOCK_TYPES.includes(v.blockType as BlockType)

/** Type guard: перевіряє, що відповідь сервера справді має форму Page. */
export function isPage(v: unknown): v is Page {
  return (
    isObject(v) &&
    typeof v.slug === 'string' &&
    typeof v.title === 'string' &&
    Array.isArray(v.blocks) &&
    v.blocks.every(isBlock)
  )
}

export async function fetchPage(slug: string, signal?: AbortSignal): Promise<Page> {
  let res: Response
  try {
    res = await fetch(`${API_URL}/api/pages/by-slug/${encodeURIComponent(slug)}`, { signal })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e
    throw new ApiError('Не вдалося з’єднатися із сервером', 0)
  }
  const body: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = isObject(body) && typeof (body as Partial<ApiErrorBody>).error === 'string'
      ? (body as ApiErrorBody).error
      : `Помилка сервера (${res.status})`
    throw new ApiError(msg, res.status)
  }
  if (!isPage(body)) throw new ApiError('Сервер повернув дані в неочікуваному форматі', 502)
  return body
}
