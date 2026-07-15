import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.103.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, authorization',
};

interface PostPayload {
  title: string;
  content?: string;
  author?: string;
  views?: number;
  tag?: string;
  sentiment?: string;
  post_date?: string;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: '请求方式不支持' }, 405);
  }

  try {
    const apiKey = req.headers.get('x-api-key') || '';
    const expectedKey = Deno.env.get('YINGDAO_API_KEY') || 'yd-rpa-2026-community-dashboard';

    if (apiKey !== expectedKey) {
      return jsonResponse({ error: 'API Key 认证失败', message: '请在请求头中传入正确的 x-api-key' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return jsonResponse({ error: '服务端配置错误' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const posts: PostPayload[] = Array.isArray(body)
      ? body
      : Array.isArray(body?.posts)
        ? body.posts
        : [];

    if (posts.length === 0) {
      return jsonResponse({ error: '请提亩有效的帖子数组', message: '请求体应为帖子对象数组或含有 posts 字段的对象' }, 400);
    }

    const tagMap: Record<string, string> = {
      '网页交互': 'T1',
      '指令报错': 'T2',
      '数据处理': 'T3',
      '第三方对接': 'T4',
      '功能咨询': 'T5',
      'T1': 'T1',
      'T2': 'T2',
      'T3': 'T3',
      'T4': 'T4',
      'T5': 'T5',
    };

    const sentimentMap: Record<string, string> = {
      '积极': 'positive',
      '中性': 'neutral',
      '消极': 'negative',
      'positive': 'positive',
      'neutral': 'neutral',
      'negative': 'negative',
    };

    const validTags = new Set(['T1', 'T2', 'T3', 'T4', 'T5']);
    const validSentiments = new Set(['positive', 'neutral', 'negative']);

    const cleaned: PostPayload[] = [];
    const errors: { index: number; reason: string }[] = [];

    posts.forEach((post, index) => {
      if (!post.title || typeof post.title !== 'string') {
        errors.push({ index, reason: '缺少帖子标题' });
        return;
      }

      let tag = (post.tag || 'T5').toString();
      tag = tagMap[tag] || tag;
      if (!validTags.has(tag)) {
        tag = 'T5';
      }

      let sentiment = (post.sentiment || 'neutral').toString();
      sentiment = sentimentMap[sentiment] || sentiment;
      if (!validSentiments.has(sentiment)) {
        sentiment = 'neutral';
      }

      let postDate = post.post_date;
      if (!postDate || !/^\d{4}-\d{2}-\d{2}$/.test(postDate)) {
        postDate = new Date().toISOString().split('T')[0];
      }

      cleaned.push({
        title: post.title.trim(),
        content: typeof post.content === 'string' ? post.content.trim() : '',
        author: typeof post.author === 'string' && post.author.trim() ? post.author.trim() : '匿名用户',
        views: Number.isFinite(Number(post.views)) && Number(post.views) >= 0 ? Number(post.views) : 0,
        tag,
        sentiment,
        post_date: postDate,
      });
    });

    if (cleaned.length === 0) {
      return jsonResponse({ error: '没有有效的帖子可导入', details: errors.slice(0, 5) }, 400);
    }

    const { data, error } = await supabase.from('posts').insert(cleaned).select('id');

    if (error) {
      return jsonResponse({ error: '数据写入失败', message: error.message }, 500);
    }

    return jsonResponse({
      success: true,
      total: posts.length,
      inserted: (data || []).length,
      failed: errors.length,
      details: errors.length > 0 ? errors.slice(0, 10) : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知错误';
    return jsonResponse({ error: '服务端异常', message }, 500);
  }
});
