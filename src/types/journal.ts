export interface TableRow {
  feature: { ar: string; en: string };
  col1: { ar: string; en: string };
  col2: { ar: string; en: string };
  col3: { ar: string; en: string };
}

export interface ComparisonTable {
  title: { ar: string; en: string };
  description?: { ar: string; en: string };
  colHeaders: { ar: string[]; en: string[] };
  rows: TableRow[];
}

export interface ArticleFAQ {
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

export interface ArticleSection {
  id: string;
  heading: { ar: string; en: string };
  level: 'h2' | 'h3';
  content: { ar: string; en: string }; // Rich Markdown-like or formatted paragraphs
  quickAnswer?: { ar: string; en: string }; // AI Overview / direct search answer callout
  proTip?: { ar: string; en: string }; // Luxury editorial expert tip
}

export interface JournalAuthor {
  name: { ar: string; en: string };
  role: { ar: string; en: string };
  bio: { ar: string; en: string };
  avatar: string;
  credentials?: { ar: string[]; en: string[] };
  specialties?: { ar: string[]; en: string[] };
  yearsOfExperience?: number;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  category: 'hair-treatments' | 'hair-coloring' | 'booking-guides' | 'nail-rituals';
  categoryLabel: { ar: string; en: string };
  readTime: { ar: string; en: string };
  wordCount: { en: number; ar: number };
  date: { ar: string; en: string };
  isoDate: string;
  author: JournalAuthor;
  heroImage: string;
  excerpt: { ar: string; en: string };
  metaDescription: { ar: string; en: string };
  primaryKeyword: string;
  secondaryKeywords: string[];
  keyTakeaways: { ar: string[]; en: string[] };
  sections: ArticleSection[];
  comparisonTable: ComparisonTable;
  faqs: ArticleFAQ[];
  companionServiceId: string;
  companionServiceName: { ar: string; en: string };
  companionServicePrice: number;
  companionServiceDuration: number;
}
