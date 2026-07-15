import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Post } from '@/types/dashboard';
import { TAG_COLORS, TAG_LABELS, SENTIMENT_LABELS, SENTIMENT_COLORS } from '@/types/dashboard';

interface TopPostsTableProps {
  posts: Post[];
}

const PAGE_SIZE = 10;

export function TopPostsTable({ posts }: TopPostsTableProps) {
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const sortedPosts = [...posts].sort((a, b) => b.views - a.views);
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
  const currentPosts = sortedPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const maxViews = sortedPosts.length > 0 ? sortedPosts[0].views : 1;

  return (
    <div className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[15px] font-semibold text-[#e8eaf0]">热门帖子 TOP 10</div>
          <div className="text-xs text-[#8b92a8]">按浏览量排序</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded-md bg-[#0f1117] border border-[#2a2f3e] text-[#8b92a8] disabled:opacity-40 hover:text-[#e8eaf0]"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs text-[#8b92a8]">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded-md bg-[#0f1117] border border-[#2a2f3e] text-[#8b92a8] disabled:opacity-40 hover:text-[#e8eaf0]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2a2f3e] hover:bg-transparent">
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider w-10">#</TableHead>
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">帖子标题</TableHead>
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider w-20">作者</TableHead>
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider w-20">标签</TableHead>
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider w-16">情感</TableHead>
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider w-28">浏览量</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPosts.map((post, index) => {
              const rank = (page - 1) * PAGE_SIZE + index + 1;
              return (
                <TableRow
                  key={post.id}
                  className="border-[#2a2f3e] cursor-pointer hover:bg-[#0f1117]"
                  onClick={() => setSelectedPost(post)}
                >
                  <TableCell className="py-3">
                    <span
                      className="font-extrabold"
                      style={{ color: rank === 1 ? '#ff4757' : rank === 2 ? '#ff6b81' : '#ffa8a8' }}
                    >
                      {rank}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 max-w-[300px] truncate text-[#e8eaf0]">{post.title}</TableCell>
                  <TableCell className="py-3 text-[#8b92a8] text-xs">{post.author}</TableCell>
                  <TableCell className="py-3">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
                      style={{ backgroundColor: `${TAG_COLORS[post.tag]}12`, color: TAG_COLORS[post.tag] }}
                    >
                      {post.tag}
                    </span>
                  </TableCell>
                  <TableCell
                    className="py-3 text-xs"
                    style={{ color: SENTIMENT_COLORS[post.sentiment] }}
                  >
                    {SENTIMENT_LABELS[post.sentiment]}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1 rounded-full bg-[#ff4757]"
                        style={{ width: `${(post.views / maxViews) * 100}%`, minWidth: '2px' }}
                      />
                      <span className="text-xs text-[#e8eaf0] font-semibold">{post.views}</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="bg-[#161922] border-[#2a2f3e] text-[#e8eaf0] max-w-[calc(100%-2rem)] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#e8eaf0]">帖子详情</DialogTitle>
            <DialogDescription className="text-[#8b92a8]">查看帖子详细信息</DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4 pt-2">
              <div>
                <div className="text-xs text-[#8b92a8] mb-1">标题</div>
                <div className="text-[15px] font-semibold text-[#e8eaf0]">{selectedPost.title}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[#8b92a8] mb-1">作者</div>
                  <div className="text-sm text-[#e8eaf0]">{selectedPost.author}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b92a8] mb-1">浏览量</div>
                  <div className="text-sm text-[#e8eaf0] flex items-center gap-1">
                    <Eye size={14} /> {selectedPost.views}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#8b92a8] mb-1">标签</div>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
                    style={{ backgroundColor: `${TAG_COLORS[selectedPost.tag]}12`, color: TAG_COLORS[selectedPost.tag] }}
                  >
                    {TAG_LABELS[selectedPost.tag]}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-[#8b92a8] mb-1">情感</div>
                  <span
                    className="text-sm"
                    style={{ color: SENTIMENT_COLORS[selectedPost.sentiment] }}
                  >
                    {SENTIMENT_LABELS[selectedPost.sentiment]}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8b92a8] mb-1">发帖日期</div>
                <div className="text-sm text-[#e8eaf0]">{selectedPost.post_date}</div>
              </div>
              {selectedPost.content && (
                <div>
                  <div className="text-xs text-[#8b92a8] mb-1">内容</div>
                  <div className="text-sm text-[#e8eaf0] leading-relaxed bg-[#0f1117] rounded-lg p-3 border border-[#2a2f3e]">
                    {selectedPost.content}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
