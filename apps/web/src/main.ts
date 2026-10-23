import './styles.css'
import type { LoadState, Page } from '@landing/types'
import { ApiError, fetchPage } from './api'
import { renderState } from './render'

const root = document.getElementById('app')
if (!root) throw new Error('#app не знайдено')

const slug = new URLSearchParams(location.search).get('page') ?? 'home'
let ctrl: AbortController | undefined

function setState(state: LoadState<Page>): void {
  root!.innerHTML = renderState(state)
  if (state.status === 'error') document.getElementById('retry')?.addEventListener('click', load)
  if (state.status === 'ready') {
    document.title = state.data.title
    bindBurger()
    bindScrollSpy()
  }
}

function bindBurger(): void {
  const nav = document.getElementById('nav')
  const burger = document.getElementById('burger')
  burger?.addEventListener('click', () => burger.setAttribute('aria-expanded', String(nav?.classList.toggle('open'))))
  nav?.addEventListener('click', () => { nav.classList.remove('open'); burger?.setAttribute('aria-expanded', 'false') })
}

function bindScrollSpy(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('#nav a:not(.nav-cta)'))
  const sections = links
    .map((a) => document.querySelector<HTMLElement>(a.getAttribute('href') ?? ''))
    .filter((el): el is HTMLElement => el !== null)
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`))
    }),
    { rootMargin: '-40% 0px -55% 0px' },
  )
  sections.forEach((el) => io.observe(el))
}

async function load(): Promise<void> {
  ctrl?.abort()
  ctrl = new AbortController()
  setState({ status: 'loading' })
  try {
    setState({ status: 'ready', data: await fetchPage(slug, ctrl.signal) })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return
    const err = e instanceof ApiError ? e : new ApiError('Невідома помилка', 500)
    setState({ status: 'error', message: err.message, code: err.code })
  }
}

void load()
