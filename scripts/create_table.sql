CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  author TEXT DEFAULT '匿名用户',
  views INTEGER DEFAULT 0,
  tag TEXT DEFAULT 'T5' CHECK (tag IN ('T1', 'T2', 'T3', 'T4', 'T5')),
  sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  post_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(post_date);
CREATE INDEX IF NOT EXISTS idx_posts_tag ON posts(tag);
CREATE INDEX IF NOT EXISTS idx_posts_sentiment ON posts(sentiment);
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);

COMMENT ON TABLE posts IS '影刀社区帖子数据表';
COMMENT ON COLUMN posts.tag IS '标签分类: T1=网页交互, T2=指令报错, T3=数据处理, T4=第三方对接, T5=功能咨询';
COMMENT ON COLUMN posts.sentiment IS '情感倾向: positive=积极, neutral=中性, negative=消极';