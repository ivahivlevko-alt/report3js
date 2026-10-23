import type { FaqBlock, FeaturesBlock, HeroBlock, LoadState, Page, PageBlock, StepsBlock } from '@landing/types'

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

const heroImage = (b: HeroBlock): string =>
  typeof b.image === 'object' && b.image
    ? `<img class="hero-img" src="${esc(b.image.url)}" alt="${esc(b.image.alt)}">` : ''

const hero = (b: HeroBlock): string => `
<section class="hero" id="block-0"><div class="wrap hero-grid"><div>
  <h1>${esc(b.heading)}</h1><p class="lead">${esc(b.lead)}</p>
  <div class="cta-row"><a class="btn-main" href="${esc(b.ctaHref)}">${esc(b.ctaLabel)}</a></div>
  <ul class="hero-facts">${(b.facts ?? []).map((f) => `<li><strong>${f.value}</strong>${esc(f.label)}</li>`).join('')}</ul>
</div>${heroImage(b)}</div></section>`

const features = (b: FeaturesBlock, i: number): string => `
<section id="block-${i}" class="section"><div class="wrap">
  <h2 class="sec-title">${esc(b.title)}</h2>${b.subtitle ? `<p class="sec-sub">${esc(b.subtitle)}</p>` : ''}
  <div class="grid3">${b.items.map((it) => `<article class="card"><svg class="ico"><use href="#i-${it.icon}"/></svg><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></article>`).join('')}</div>
</div></section>`

const steps = (b: StepsBlock, i: number): string => `
<section id="block-${i}" class="section alt"><div class="wrap"><h2 class="sec-title">${esc(b.title)}</h2>
  <ol class="steps">${b.steps.map((s, n) => `<li><b>${n + 1}</b><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>
</div></section>`

const faq = (b: FaqBlock, i: number): string => `
<section id="block-${i}" class="section"><div class="wrap narrow"><h2 class="sec-title">${esc(b.title)}</h2>
  ${b.questions.map((q) => `<details><summary>${esc(q.question)}</summary><p>${esc(q.answer)}</p></details>`).join('')}
</div></section>`

/** Шаблонізація блока: switch по discriminated union + перевірка вичерпності. */
export function renderBlock(b: PageBlock, i: number): string {
  switch (b.blockType) {
    case 'hero': return hero(b)
    case 'features': return features(b, i)
    case 'steps': return steps(b, i)
    case 'faq': return faq(b, i)
    default: { const _never: never = b; return _never }
  }
}

const blockTitle = (b: PageBlock): string | null => (b.blockType === 'hero' ? null : b.title)

function header(page: Page): string {
  const links = page.blocks
    .map((b, i) => ({ t: blockTitle(b), i }))
    .filter((l): l is { t: string; i: number } => l.t !== null)
    .map((l) => `<a href="#block-${l.i}">${esc(l.t)}</a>`).join('')
  const hero = page.blocks.find((b): b is HeroBlock => b.blockType === 'hero')
  const cta = hero ? `<a class="nav-cta" href="${esc(hero.ctaHref)}">${esc(hero.ctaLabel)}</a>` : ''
  return `<header class="top"><div class="wrap bar">
    <a class="brand" href="#block-0"><span class="mark" aria-hidden="true"></span>${esc(page.title)}</a>
    <button class="burger" id="burger" type="button" aria-label="Меню" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Розділи">${links}${cta}</nav></div></header>`
}

/** Один рендер на кожен стан: loading / error / ready. */
export function renderState(state: LoadState<Page>): string {
  switch (state.status) {
    case 'loading':
      return `<div class="state" role="status"><div class="spinner"></div><p>Завантаження сторінки…</p></div>`
    case 'error':
      return `<div class="state err" role="alert"><h2>${state.code === 404 ? 'Сторінку не знайдено' : 'Щось пішло не так'}</h2>
        <p>${esc(state.message)}</p><button class="btn-main" id="retry" type="button">Спробувати ще раз</button></div>`
    case 'ready': {
      const p = state.data
      return `${header(p)}<main>${p.blocks.map(renderBlock).join('')}</main>
        <footer class="foot"><div class="wrap"><p>${esc(p.footer ?? '')}</p></div></footer>`
    }
  }
}
