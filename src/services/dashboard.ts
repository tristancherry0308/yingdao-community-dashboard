import { supabase } from '@/db/supabase';
import type { Post, TagType, SentimentType } from '@/types/dashboard';

export interface FetchPostsOptions {
  startDate?: string;
  endDate?: string;
  tags?: TagType[];
  sentiments?: SentimentType[];
  limit?: number;
  orderBy?: 'views' | 'post_date';
  ascending?: boolean;
}

export async function fetchPosts(options: FetchPostsOptions = {}): Promise<Post[]> {
  let query = supabase.from('posts').select('*');

  if (options.startDate) {
    query = query.gte('post_date', options.startDate);
  }

  if (options.endDate) {
    query = query.lte('post_date', options.endDate);
  }

  if (options.tags && options.tags.length > 0) {
    query = query.in('tag', options.tags);
  }

  if (options.sentiments && options.sentiments.length > 0) {
    query = query.in('sentiment', options.sentiments);
  }

  const orderField = options.orderBy || 'post_date';
  const ascending = options.ascending ?? false;
  query = query.order(orderField, { ascending });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Post[];
}

export async function insertPost(post: Omit<Post, 'id' | 'created_at'>): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: post.title,
      content: post.content,
      author: post.author,
      views: post.views,
      tag: post.tag,
      sentiment: post.sentiment,
      post_date: post.post_date,
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('插入后未能返回数据');
  }

  return data as Post;
}
