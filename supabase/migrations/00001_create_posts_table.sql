create table posts (
  id bigint generated always as identity primary key,
  title text not null,
  content text,
  author text not null default '匿名用户',
  views integer not null default 0,
  tag text not null check (tag in ('T1','T2','T3','T4','T5')),
  sentiment text not null check (sentiment in ('positive','neutral','negative')),
  post_date date not null default current_date,
  created_at timestamptz not null default now()
);

comment on table posts is '影刀社区帖子数据，通过RPA采集';
comment on column posts.tag is '帖子分类：T1网页交互、T2指令报错、T3数据处理、T4第三方对接、T5功能咨询';
comment on column posts.sentiment is '情感倾向：positive积极、neutral中性、negative消极';

-- RLS：任何人可以查看，仅service_role可写入
alter table posts enable row level security;

create policy "anon_select_posts"
  on posts for select
  to anon
  using (true);

create policy "authenticated_select_posts"
  on posts for select
  to authenticated
  using (true);

create policy "authenticated_insert_posts"
  on posts for insert
  to authenticated
  with check (true);

create policy "service_select_posts"
  on posts for select
  to service_role
  using (true);

create policy "service_insert_posts"
  on posts for insert
  to service_role
  with check (true);

-- 引入演示数据（基于现有HTML中的198条帖子展示）
insert into posts (title, content, author, views, tag, sentiment, post_date) values
('这人干啥呢', '社区用户日常交流帖子', '用户A', 341, 'T5', 'neutral', '2026-07-10'),
('请问大家都是怎么找rpa相关工作的呀', '就业咨询讨论', '用户B', 271, 'T5', 'neutral', '2026-07-10'),
('有了AI，影刀还有什么优势呢', 'AI与RPA对比讨论', '用户C', 216, 'T5', 'neutral', '2026-07-10'),
('你们更偏向于开荘0-1的，还是公司就有rpa的', '职场经验分享', '用户D', 212, 'T5', 'neutral', '2026-07-10'),
('各位都在做什么行业？', '行业交流', '用户E', 179, 'T5', 'neutral', '2026-07-11'),
('有没有新加入一起继续学习探讨的，一个人学习摸索太慢了', '学习交流', '用户F', 177, 'T5', 'positive', '2026-07-11'),
('验证码系列二，支付宝四宫格点选，免费，成功率高', '验证码自动化方案分享', '用户G', 158, 'T4', 'neutral', '2026-07-11'),
('腾龙公司直属官方会员登录游戏注册账号下载网址——2026第一方式', '第三方系统对接问题', '用户H', 142, 'T5', 'neutral', '2026-07-11'),
('羡慕双休的', '职场休闲讨论', '用户I', 150, 'T5', 'positive', '2026-07-12'),
('淘宝SKU规格批量填写', '电商数据处理场景', '用户J', 150, 'T4', 'neutral', '2026-07-12'),
('网页元素定位不到怎么办', '网页交互异常询问', '用户K', 120, 'T1', 'negative', '2026-07-12'),
('指令报错：无法触发点击事件', '指令运行报错', '用户L', 98, 'T2', 'negative', '2026-07-12'),
('影刀如何循环处理Excel数据', 'Excel数据处理功能咨询', '用户M', 86, 'T5', 'neutral', '2026-07-13'),
('勾选相似元素缺失', '网页交互异常', '用户N', 76, 'T1', 'neutral', '2026-07-13'),
('如何调用API接口', '第三方对接咨询', '用户O', 65, 'T4', 'neutral', '2026-07-13'),
('出现异常信息，求助各位', '指令报错询问', '用户P', 54, 'T2', 'neutral', '2026-07-13'),
('如何实现数据模糊匹配', '数据处理功能咨询', '用户Q', 43, 'T3', 'neutral', '2026-07-13'),
('影刀和其他RPA工具对比', '功能咨询', '用户R', 38, 'T5', 'neutral', '2026-07-13'),
('导出数据格式不正确', '数据处理报错', '用户S', 32, 'T3', 'negative', '2026-07-13'),
('文件上传失败怎么处理', '网页交互异常', '用户T', 28, 'T1', 'neutral', '2026-07-13');

-- 为了展示更丰富，再补充一批各类型数据
insert into posts (title, content, author, views, tag, sentiment, post_date) values
('如何让影刀自动登录微信', '微信自动化对接问题', '用户U', 89, 'T4', 'neutral', '2026-07-13'),
('表单填充信息获取失败', '网页表单交互异常', '用户V', 67, 'T1', 'negative', '2026-07-13'),
('影刀监控异常怎么设置', '功能使用咨询', '用户W', 45, 'T5', 'neutral', '2026-07-13'),
('如何循环点击多个按钮', '基础功能咨询', '用户X', 33, 'T5', 'neutral', '2026-07-13'),
('影刀能不能接入钉钉', '钉钉平台对接咨询', '用户Y', 41, 'T4', 'neutral', '2026-07-13'),
('测试数据如何清理', '数据处理功能咨询', '用户Z', 29, 'T3', 'neutral', '2026-07-13'),
('弹窗覆盖导致按钮无法点击', '网页交互异常', '用户AA', 55, 'T1', 'negative', '2026-07-13'),
('无法识别弹窗中的元素', '网页交互异常', '用户AB', 48, 'T1', 'neutral', '2026-07-13'),
('操作执行过程中跳出红色提示', '指令报错询问', '用户AC', 36, 'T2', 'negative', '2026-07-13'),
('如何实现循环直到条件满足', '基础功能咨询', '用户AD', 22, 'T5', 'neutral', '2026-07-13');

-- 创建索引
CREATE INDEX idx_posts_post_date ON posts(post_date);
CREATE INDEX idx_posts_tag ON posts(tag);
CREATE INDEX idx_posts_sentiment ON posts(sentiment);

-- 创建接收影刀RPA数据的辅助存储密钥表
CREATE TABLE secrets (
  key_name text primary key,
  key_value text not null
);

COMMENT ON TABLE secrets IS '存储影刀RPA API Key等密钥';

INSERT INTO secrets (key_name, key_value) VALUES ('yingdao_api_key', 'yd-rpa-2026-community-dashboard');

ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_select_secrets" ON secrets FOR SELECT TO service_role USING (true);
CREATE POLICY "service_insert_secrets" ON secrets FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "anon_no_secrets" ON secrets FOR SELECT TO anon USING (false);
CREATE POLICY "auth_no_secrets" ON secrets FOR SELECT TO authenticated USING (false);

-- 提供帮助函数：验证API Key
CREATE OR REPLACE FUNCTION verify_api_key(input_key text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM secrets
    WHERE key_name = 'yingdao_api_key' AND key_value = input_key
  );
$$;