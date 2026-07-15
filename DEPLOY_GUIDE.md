# 影刀社区数据看板 - 详细部署指南

---

## 📺 第一步：打开命令行工具

### 方法 1：使用 PowerShell（推荐）
1. 按下键盘上的 `Win + R` 组合键
2. 在弹出的"运行"窗口中输入 `powershell`
3. 点击"确定"或按回车键

### 方法 2：使用命令提示符
1. 按下键盘上的 `Win + R` 组合键
2. 在弹出的"运行"窗口中输入 `cmd`
3. 点击"确定"或按回车键

### 方法 3：使用 VS Code 的终端（推荐，如果你用 VS Code）
1. 打开 VS Code
2. 点击顶部菜单的"终端" → "新建终端"
3. 在弹出的终端中操作

---

## ✅ 第二步：验证 Git 是否安装成功

打开命令行后，输入以下命令并按回车：

```bash
git --version
```

**如果看到类似下面的输出，说明 Git 安装成功：**
```
git version 2.x.x.windows.x
```

**如果看到"不是内部或外部命令"，说明 Git 没有安装或没有配置到环境变量：**
- 重新安装 Git，安装时勾选"Add Git to PATH"选项
- 安装完成后，**必须关闭当前命令行窗口，重新打开一个新的**

---

## 🚀 第三步：初始化 Git 仓库

### 第 3.1 步：进入项目目录

在命令行中输入以下命令，**每输入一行按一次回车**：

```bash
cd "c:\Users\24450\Desktop\影刀社区帖子数据更新\yingdao-community-dashboard"
```

**验证是否进入了正确目录：**
```bash
dir
```

你应该能看到项目文件列表，包括 `package.json`、`src` 文件夹等。

### 第 3.2 步：初始化 Git 仓库

```bash
git init
```

**预期输出：**
```
Initialized empty Git repository in c:/Users/24450/Desktop/影刀社区帖子数据更新/yingdao-community-dashboard/.git/
```

### 第 3.3 步：配置 Git 用户信息

**替换成你自己的 GitHub 用户名和邮箱！**

```bash
git config user.name "你的GitHub用户名"
git config user.email "你的GitHub邮箱地址"
```

### 第 3.4 步：添加所有文件

```bash
git add .
```

### 第 3.5 步：查看状态（可选但推荐）

```bash
git status
```

你应该看到所有文件都变成了绿色，表示已经添加到暂存区。

### 第 3.6 步：提交代码

```bash
git commit -m "初始化影刀社区数据看板项目"
```

**预期输出：**
```
[main (root-commit) xxxxxxx] 初始化影刀社区数据看板项目
 100 files changed, xxxxx insertions(+)
 create mode 100644 ...
```

---

## 🚀 第四步：创建 GitHub 仓库并推送

### 第 4.1 步：在 GitHub 创建仓库

1. 打开浏览器，访问 https://github.com/
2. 登录你的 GitHub 账号
3. 点击右上角的 **+** 号，选择"New repository"
4. 在"Repository name"处输入 `yingdao-community-dashboard`
5. 其他选项保持默认，点击"Create repository"

### 第 4.2 步：获取仓库地址

创建成功后，你会看到一个页面，找到"Quick setup"部分，复制仓库的 HTTPS 地址：

```
https://github.com/你的用户名/yingdao-community-dashboard.git
```

### 第 4.3 步：添加远程仓库地址

回到命令行，输入以下命令（替换成你的仓库地址）：

```bash
git remote add origin https://github.com/你的用户名/yingdao-community-dashboard.git
```

### 第 4.4 步：推送到 GitHub

```bash
git push -u origin main
```

**第一次推送会弹出登录窗口：**
- 选择"Sign in with your browser"
- 在浏览器中登录你的 GitHub 账号
- 登录成功后，命令行会自动继续执行

**预期输出：**
```
Enumerating objects: xxx, done.
Counting objects: 100% (xxx/xxx), done.
Delta compression using up to x threads
Compressing objects: 100% (xxx/xxx), done.
Writing objects: 100% (xxx/xxx), xxx bytes | xxx KiB/s, done.
Total xxx (delta xxx), reused xxx (delta xxx), pack-reused xxx
To https://github.com/你的用户名/yingdao-community-dashboard.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**验证：** 刷新 GitHub 页面，你应该能看到所有文件已经上传成功。

---

## 🚀 第五步：配置 Supabase 数据库

### 第 5.1 步：登录 Supabase

1. 打开浏览器，访问 https://backend.appmiaoda.com/
2. 使用已有账号登录

### 第 5.2 步：打开 SQL 编辑器

1. 在左侧菜单中点击"SQL Editor"
2. 点击"New query"

### 第 5.3 步：创建 posts 表

将以下 SQL 代码复制粘贴到编辑器中：

```sql
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
```

点击"Run"按钮执行。

### 第 5.4 步：配置 RLS 策略

继续在 SQL 编辑器中执行：

```sql
CREATE POLICY "Allow public read access" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write access" ON posts
  FOR INSERT WITH CHECK (true);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### 第 5.5 步：导入 Excel 数据

回到命令行，执行以下命令：

```bash
cd "c:\Users\24450\Desktop\影刀社区帖子数据更新\yingdao-community-dashboard\scripts"
pip install openpyxl requests
python import_data.py
```

**执行过程：**
1. 脚本会读取 Excel 文件
2. 显示读取到的数据条数
3. 询问是否确认推送，输入 `y` 并按回车
4. 等待数据导入完成

**预期输出：**
```
============================================================
影刀社区帖子数据导入工具
============================================================
Excel 表头: ['帖子标题', '帖子内容', '帖子作者', '帖子浏览量', '帖子标签分类', '帖子情感倾向', '发帖日期']
共读取 198 条帖子数据

数据转换完成，准备推送...
推送地址: https://backend.appmiaoda.com/projects/supabase335579975837069312/functions/v1/receive-posts
数据条数: 198

确认推送数据到数据库? (y/N): y
批次 1: 成功插入 50 条
批次 2: 成功插入 50 条
批次 3: 成功插入 50 条
批次 4: 成功插入 48 条

数据导入完成，总计插入 198 条
```

---

## 🚀 第六步：部署到 Vercel

### 第 6.1 步：登录 Vercel

1. 打开浏览器，访问 https://vercel.com/
2. 点击"Sign in"，选择用 GitHub 账号登录

### 第 6.2 步：创建新项目

1. 登录后，点击"New Project"
2. 在"Import Git Repository"页面，找到你的 `yingdao-community-dashboard` 仓库
3. 点击仓库旁边的"Import"按钮

### 第 6.3 步：配置项目

1. 在"Configure Project"页面：
   - **Framework Preset**: 选择 `React`
   - **Build Command**: 输入 `npm run build`
   - **Output Directory**: 输入 `dist`

2. 点击"Environment Variables"部分的"Add"按钮，添加以下三个环境变量：

| 变量名 | 值 |
|--------|-----|
| VITE_SUPABASE_URL | https://backend.appmiaoda.com/projects/supabase335579975837069312 |
| VITE_SUPABASE_ANON_KEY | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDk5NDM1NzAxLCJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwic3ViIjoiYW5vbiJ9.rGQQRalkQxYFDZlxk3LRkjCPLXU-uwiNUntewsi-eD8 |
| VITE_APP_ID | app-d0ehzpqqdy4h |

### 第 6.4 步：部署

点击页面底部的"Deploy"按钮，等待部署完成。

**部署完成后：**
- Vercel 会给你一个公网访问地址，类似 `https://yingdao-community-dashboard.vercel.app`
- 点击这个地址，你就能看到数据看板了！

---

## 🚀 第七步：配置影刀 RPA 推送

### 第 7.1 步：打开影刀 RPA

打开你的影刀 RPA 软件，找到你创建的"收集社区问答界面帖子"的流程。

### 第 7.2 步：添加 HTTP 请求节点

在流程末尾添加一个"HTTP 请求"节点，配置如下：

| 配置项 | 值 |
|--------|-----|
| 请求方式 | POST |
| 请求地址 | https://backend.appmiaoda.com/projects/supabase335579975837069312/functions/v1/receive-posts |

### 第 7.3 步：添加请求头

点击"请求头"，添加以下内容：

| 键 | 值 |
|----|-----|
| x-api-key | yd-rpa-2026-community-dashboard |
| Content-Type | application/json |

### 第 7.4 步：配置请求体

点击"请求体"，选择"JSON"格式，输入以下内容：

```json
[
  {
    "title": "帖子标题字段",
    "content": "帖子内容字段",
    "author": "帖子作者字段",
    "views": 帖子浏览量字段,
    "tag": "T5",
    "sentiment": "neutral",
    "post_date": "当前日期"
  }
]
```

**注意：** 替换成你 RPA 中对应的变量名称。

### 第 7.5 步：标签分类映射

根据你的数据分析结果，设置正确的标签：

| 标签值 | 含义 |
|--------|------|
| T1 | 网页交互 |
| T2 | 指令报错 |
| T3 | 数据处理 |
| T4 | 第三方对接 |
| T5 | 功能咨询 |

### 第 7.6 步：情感倾向映射

| 情感值 | 含义 |
|--------|------|
| positive | 积极 |
| neutral | 中性 |
| negative | 消极 |

---

## 🎉 完成！

现在你的数据看板已经部署到公网了！

### 访问地址

- **数据看板首页**: `https://yingdao-community-dashboard.vercel.app`
- **数据管理后台**: `https://yingdao-community-dashboard.vercel.app/admin`

### 功能说明

| 功能模块 | 说明 |
|---------|------|
| **KPI 卡片** | 总帖子数、最高浏览量、热门标签、网页交互异常、情感中性率 |
| **核心洞察** | 基于数据的关键发现和建议 |
| **数据可视化** | 每日活跃度趋势、问题类型分布、情感倾向分析 |
| **热门帖子 TOP 10** | 按浏览量排序 |
| **行动建议** | 基于数据的可落地方案 |
| **管理后台** | 数据筛选、手动添加帖子、RPA 对接文档 |

### 数据更新机制

1. **自动刷新**: 看板每 5 分钟自动刷新一次数据
2. **RPA 推送**: 影刀 RPA 采集到新数据后推送到 API，数据库实时更新
3. **手动刷新**: 在管理后台点击刷新按钮手动更新

---

## ❌ 常见问题及解决方法

### 问题 1：Git 推送时提示"Authentication failed"
**解决方法：**
1. 确保你的 GitHub 账号密码正确
2. 如果开启了 2FA，需要使用 GitHub Personal Access Token 作为密码
3. 在 GitHub 设置中创建一个新的 Personal Access Token（勾选 repo 权限）
4. 推送时用 Token 代替密码

### 问题 2：Vercel 构建失败
**解决方法：**
1. 检查环境变量是否正确配置
2. 检查 Build Command 是否为 `npm run build`
3. 检查 Output Directory 是否为 `dist`
4. 在本地运行 `npm run build` 测试构建是否成功

### 问题 3：看板显示"演示数据"提示
**解决方法：**
这是正常现象，因为初始数据是批量导入的。当你的 RPA 开始推送新数据后，提示会自动消失。

### 问题 4：数据不显示
**解决方法：**
1. 检查 Supabase 表是否创建成功
2. 检查环境变量中的 Supabase URL 和 KEY 是否正确
3. 检查 RLS 策略是否正确配置
4. 在浏览器开发者工具中查看 Console 是否有错误信息

### 问题 5：PowerShell 中输入命令没反应
**解决方法：**
1. 确保每输入一行命令后按了回车键
2. 如果命令正在执行，等待它完成（可能需要几秒钟）
3. 如果长时间没反应，按 `Ctrl + C` 中断，重新执行

---

如果你在执行过程中遇到任何问题，**请截图发给我**，我会帮你解决！