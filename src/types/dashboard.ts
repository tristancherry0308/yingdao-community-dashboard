export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  views: number;
  tag: 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
  sentiment: 'positive' | 'neutral' | 'negative';
  post_date: string;
  created_at: string;
}

export type TagType = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
export type SentimentType = 'positive' | 'neutral' | 'negative';

export const TAG_LABELS: Record<TagType, string> = {
  T1: '网页交互',
  T2: '指令报错',
  T3: '数据处理',
  T4: '第三方对接',
  T5: '功能咨询',
};

export const SENTIMENT_LABELS: Record<SentimentType, string> = {
  positive: '积极',
  neutral: '中性',
  negative: '消极',
};

export const TAG_COLORS: Record<TagType, string> = {
  T1: '#ff4757',
  T2: '#4dabf7',
  T3: '#51cf66',
  T4: '#fcc419',
  T5: '#9775fa',
};

export const SENTIMENT_COLORS: Record<SentimentType, string> = {
  positive: '#51cf66',
  neutral: '#8b92a8',
  negative: '#ff4757',
};
