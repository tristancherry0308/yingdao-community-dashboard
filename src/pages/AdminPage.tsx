import { useEffect, useState, useCallback } from 'react';
import { subDays, format } from 'date-fns';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Copy, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { fetchPosts, insertPost } from '@/services/dashboard';
import {
  TAG_LABELS,
  TAG_COLORS,
  SENTIMENT_LABELS,
  SENTIMENT_COLORS,
  type Post,
  type TagType,
  type SentimentType,
} from '@/types/dashboard';

const API_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/receive-posts`;
const API_KEY = 'yd-rpa-2026-community-dashboard';

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tagFilter, setTagFilter] = useState<TagType | 'all'>('all');
  const [sentimentFilter, setSentimentFilter] = useState<SentimentType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: '',
    views: '',
    tag: 'T5' as TagType,
    sentiment: 'neutral' as SentimentType,
    post_date: format(new Date(), 'yyyy-MM-dd'),
  });

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchPosts({
        startDate,
        endDate,
        tags: tagFilter === 'all' ? undefined : [tagFilter],
        sentiments: sentimentFilter === 'all' ? undefined : [sentimentFilter],
        orderBy: 'post_date',
        ascending: false,
      });
      setPosts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : '数据加载失败';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, tagFilter, sentimentFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filteredPosts = posts.filter((post) =>
    search
      ? post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.author.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const handleAddPost = async () => {
    if (!newPost.title.trim()) {
      toast.error('请输入帖子标题');
      return;
    }
    try {
      await insertPost({
        title: newPost.title,
        content: newPost.content,
        author: newPost.author || '匿名用户',
        views: Number(newPost.views) || 0,
        tag: newPost.tag,
        sentiment: newPost.sentiment,
        post_date: newPost.post_date,
      });
      toast.success('帖子添加成功');
      setIsAddOpen(false);
      setNewPost({
        title: '',
        content: '',
        author: '',
        views: '',
        tag: 'T5',
        sentiment: 'neutral',
        post_date: format(new Date(), 'yyyy-MM-dd'),
      });
      loadPosts();
    } catch (err) {
      const message = err instanceof Error ? err.message : '添加失败';
      toast.error(message);
    }
  };

  const copyEndpoint = () => {
    navigator.clipboard.writeText(API_ENDPOINT);
    toast.success('接口地址已复制');
  };

  const copyPayload = () => {
    const payload = JSON.stringify(
      [
        {
          title: '示例帖子标题',
          content: '示例帖子内容',
          author: '匿名用户',
          views: 100,
          tag: 'T5',
          sentiment: 'neutral',
          post_date: '2026-07-14',
        },
      ],
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    toast.success('请求示例已复制');
  };

  return (
    <>
      <PageMeta title="数据管理 | 影刀社区数据看板" description="影刀社区帖子数据管理后台" />
      <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161922] border border-[#2a2f3e] text-[#8b92a8] hover:text-[#e8eaf0] hover:border-[#ff4757]/50 text-xs transition-colors"
              >
                <ArrowLeft size={14} />
                返回看板
              </Link>
              <div>
                <h1 className="text-xl font-extrabold text-[#e8eaf0]">数据管理后台</h1>
                <p className="text-[13px] text-[#8b92a8]">查看、筛选和手动添加帖子数据</p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-[#ff4757] text-[#0f1117] hover:bg-[#ff6b81] font-semibold"
            >
              <Plus size={16} className="mr-1" />
              添加帖子
            </Button>
          </div>

          <div className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#ff4757]" />
                <span className="text-sm font-semibold text-[#e8eaf0]">日期范围</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] w-auto"
                />
                <span className="text-[#8b92a8]">—</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] w-auto"
                />
                <Select value={tagFilter} onValueChange={(v) => setTagFilter(v as TagType | 'all')}>
                  <SelectTrigger className="w-[160px] bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0]">
                    <SelectValue placeholder="标签分类" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161922] border-[#2a2f3e]">
                    <SelectItem value="all">全部标签</SelectItem>
                    {Object.entries(TAG_LABELS).map(([tag, label]) => (
                      <SelectItem key={tag} value={tag}>
                        {tag} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sentimentFilter} onValueChange={(v) => setSentimentFilter(v as SentimentType | 'all')}>
                  <SelectTrigger className="w-[160px] bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0]">
                    <SelectValue placeholder="情感倾向" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161922] border-[#2a2f3e]">
                    <SelectItem value="all">全部情感</SelectItem>
                    {Object.entries(SENTIMENT_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b92a8]" />
                  <Input
                    placeholder="搜索标题或作者"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] w-[200px]"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={loadPosts}
                  disabled={isLoading}
                  className="bg-[#0f1117] border-[#2a2f3e] text-[#8b92a8] hover:text-[#e8eaf0] hover:bg-[#1e2230]"
                >
                  {isLoading ? '加载中...' : '查询'}
                </Button>
              </div>
            </div>
          </div>

          <div id="rpa-docs" className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 text-[15px] font-semibold text-[#e8eaf0] mb-4">
              <span className="text-[#4dabf7]">■</span>
              影刀RPA对接接口文档
            </div>
            <div className="mb-4 p-3 bg-[#fcc419]/10 border border-[#fcc419]/30 rounded-lg text-xs text-[#fcc419] leading-relaxed">
              请在影刀RPA流程中添加 HTTP 请求节点，将采集到的帖子数组推送到下方地址。推送成功后，看板首页将自动从示例数据切换为RPA实时数据。
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-[#8b92a8] w-20 shrink-0">请求地址</span>
                <code className="flex-1 bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3 py-2 text-[#e8eaf0] break-all">
                  {API_ENDPOINT}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyEndpoint}
                  className="bg-[#0f1117] border-[#2a2f3e] text-[#8b92a8] hover:text-[#e8eaf0]"
                >
                  <Copy size={14} className="mr-1" />
                  复制
                </Button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-[#8b92a8] w-20 shrink-0">认证方式</span>
                <code className="flex-1 bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3 py-2 text-[#e8eaf0]">
                  Header: x-api-key = {API_KEY}
                </code>
              </div>
              <div className="flex flex-col md:flex-row md:items-start gap-2">
                <span className="text-[#8b92a8] w-20 shrink-0 pt-2">请求示例</span>
                <pre className="flex-1 bg-[#0f1117] border border-[#2a2f3e] rounded-lg p-3 text-xs text-[#e8eaf0] overflow-x-auto">
                  {JSON.stringify(
                    [
                      {
                        title: '示例帖子标题',
                        content: '示例帖子内容',
                        author: '匿名用户',
                        views: 100,
                        tag: 'T5',
                        sentiment: 'neutral',
                        post_date: '2026-07-14',
                      },
                    ],
                    null,
                    2
                  )}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPayload}
                  className="bg-[#0f1117] border-[#2a2f3e] text-[#8b92a8] hover:text-[#e8eaf0]"
                >
                  <Copy size={14} className="mr-1" />
                  复制
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[15px] font-semibold text-[#e8eaf0]">帖子列表</div>
              <span className="text-xs text-[#8b92a8]">共 {filteredPosts.length} 条</span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2a2f3e] hover:bg-transparent">
                    <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">ID</TableHead>
                    <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">标题</TableHead>
                    <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">作者</TableHead>
                    <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">浏览量</TableHead>
                    <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">标签</TableHead>
                    <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">情感</TableHead>
                    <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">日期</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id} className="border-[#2a2f3e] hover:bg-[#0f1117]">
                      <TableCell className="py-3 text-[#8b92a8] text-xs">{post.id}</TableCell>
                      <TableCell className="py-3 text-[#e8eaf0] max-w-[300px] truncate">{post.title}</TableCell>
                      <TableCell className="py-3 text-[#8b92a8] text-xs">{post.author}</TableCell>
                      <TableCell className="py-3 text-[#e8eaf0] text-xs">{post.views}</TableCell>
                      <TableCell className="py-3">
                        <Badge
                          className="text-[11px] font-semibold"
                          style={{
                            backgroundColor: `${TAG_COLORS[post.tag]}12`,
                            color: TAG_COLORS[post.tag],
                            borderColor: `${TAG_COLORS[post.tag]}30`,
                          }}
                        >
                          {TAG_LABELS[post.tag]}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-xs" style={{ color: SENTIMENT_COLORS[post.sentiment] }}>
                        {SENTIMENT_LABELS[post.sentiment]}
                      </TableCell>
                      <TableCell className="py-3 text-[#8b92a8] text-xs">{post.post_date}</TableCell>
                    </TableRow>
                  ))}
                  {filteredPosts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-[#8b92a8]">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#161922] border-[#2a2f3e] text-[#e8eaf0] max-w-[calc(100%-2rem)] md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#e8eaf0]">手动添加帖子</DialogTitle>
            <DialogDescription className="text-[#8b92a8]">
              填写下方信息后提交，数据将写入数据库
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-[#8b92a8] text-xs">帖子标题 *</Label>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="输入帖子标题"
                className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] mt-1"
              />
            </div>
            <div>
              <Label className="text-[#8b92a8] text-xs">帖子内容</Label>
              <Input
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="输入帖子内容"
                className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#8b92a8] text-xs">作者</Label>
                <Input
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  placeholder="匿名用户"
                  className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] mt-1"
                />
              </div>
              <div>
                <Label className="text-[#8b92a8] text-xs">浏览量</Label>
                <Input
                  type="number"
                  value={newPost.views}
                  onChange={(e) => setNewPost({ ...newPost, views: e.target.value })}
                  placeholder="0"
                  className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#8b92a8] text-xs">标签分类</Label>
                <Select value={newPost.tag} onValueChange={(v) => setNewPost({ ...newPost, tag: v as TagType })}>
                  <SelectTrigger className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161922] border-[#2a2f3e]">
                    {Object.entries(TAG_LABELS).map(([tag, label]) => (
                      <SelectItem key={tag} value={tag}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#8b92a8] text-xs">情感倾向</Label>
                <Select
                  value={newPost.sentiment}
                  onValueChange={(v) => setNewPost({ ...newPost, sentiment: v as SentimentType })}
                >
                  <SelectTrigger className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161922] border-[#2a2f3e]">
                    {Object.entries(SENTIMENT_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-[#8b92a8] text-xs">发帖日期</Label>
              <Input
                type="date"
                value={newPost.post_date}
                onChange={(e) => setNewPost({ ...newPost, post_date: e.target.value })}
                className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] mt-1"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="bg-[#0f1117] border-[#2a2f3e] text-[#8b92a8] hover:text-[#e8eaf0]"
              >
                取消
              </Button>
              <Button onClick={handleAddPost} className="bg-[#ff4757] text-[#0f1117] hover:bg-[#ff6b81] font-semibold">
                提交
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
