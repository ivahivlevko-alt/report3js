/** Спільні типи сторінки та блоків: використовують і CMS, і клієнт. */

// ---- Type Aliases ----
export type BlockType = 'hero' | 'features' | 'steps' | 'faq';
export type IconName = 'box' | 'cart' | 'tag' | 'chart' | 'shield' | 'alert';
export type Timestamps = { createdAt: string; updatedAt: string };

export type Media = { id: number; url: string; alt: string };

// ---- Intersection Types: базові поля + поля конкретного блока ----
type BlockBase<T extends BlockType> = { id?: string; blockType: T; blockName?: string | null };

export type HeroBlock = BlockBase<'hero'> & {
  pill?: string;
  heading: string;
  lead: string;
  ctaLabel: string;
  ctaHref: string;
  facts?: { value: number; label: string }[];
  image?: Media | number | null; // upload: id або розгорнутий документ
};
export type FeatureItem = { title: string; text: string; icon: IconName };
export type FeaturesBlock = BlockBase<'features'> & {
  title: string;
  subtitle?: string;
  items: FeatureItem[];
};
export type StepsBlock = BlockBase<'steps'> & {
  title: string;
  steps: { title: string; text: string }[];
};
export type FaqBlock = BlockBase<'faq'> & {
  title: string;
  questions: { question: string; answer: string }[];
};

// ---- Union Type: будь-який блок сторінки (discriminated по blockType) ----
export type PageBlock = HeroBlock | FeaturesBlock | StepsBlock | FaqBlock;

export type Page = {
  id: number;
  title: string;
  slug: string;
  footer?: string;
  blocks: PageBlock[];
} & Timestamps;

// ---- Стан UI: loading / error / ready ----
export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string; code?: number }
  | { status: 'ready'; data: T };

export type ApiErrorBody = { error: string };
