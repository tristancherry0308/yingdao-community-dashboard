-- 删除之前不完善的 authenticated insert 策略，因为前端没有登录时无法通过 authenticated 身份提交
DROP POLICY IF EXISTS "authenticated_insert_posts" ON posts;

-- 允许匿名用户（anon）插入数据，用于 admin 页面手动添加帖子
CREATE POLICY "anon_insert_posts"
  ON posts FOR insert
  TO anon
  WITH CHECK (true);

-- 确保 anon 也能查看（已存在 anon_select_posts，这里确认）