import { useEffect, useState, useCallback } from 'react';
import { subDays, format } from 'date-fns';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import { Header } from '@/components/dashboard/Header';
import { DashboardFilters, type FilterState } from '@/components/dashboard/DashboardFilters';
import { KPICards } from '@/components/dashboard/KPICards';
import { Insights } from '@/components/dashboard/Insights';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { TagDistributionChart } from '@/components/dashboard/TagDistributionChart';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { TagDetailTable } from '@/components/dashboard/TagDetailTable';
import { TopPostsTable } from '@/components/dashboard/TopPostsTable';
import { ActionPanel } from '@/components/dashboard/ActionPanel';
import { fetchPosts } from '@/services/dashboard';
import type { Post } from '@/types/dashboard';

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    tags: [],
    sentiments: [],
  });
  const [isDemoData, setIsDemoData] = useState(false);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchPosts({
        startDate: filters.startDate,
        endDate: filters.endDate,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        sentiments: filters.sentiments.length > 0 ? filters.sentiments : undefined,
        orderBy: 'views',
        ascending: false,
      });
      setPosts(data);
      // 判断是否为演示数据：如果所有帖子 created_at 时间相同（秒级），则认为是批量导入的演示数据
      const isDemo =
        data.length > 0 &&
        data.every((post) => post.created_at && post.created_at.slice(0, 19) === data[0].created_at.slice(0, 19));
      setIsDemoData(isDemo);
      setLastUpdated(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : '数据加载失败';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadPosts();
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [loadPosts]);

  return (
    <>
      <PageMeta title="影刀社区数据看板" description="影刀社区问答界面帖子数据看板，实时洞察用户痛点与社区健康度" />
      <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
          <Header lastUpdated={lastUpdated} isDemoData={isDemoData} />
          <DashboardFilters
            filters={filters}
            onChange={setFilters}
            onRefresh={loadPosts}
            isLoading={isLoading}
          />

          {isDemoData && (
            <div className="bg-[#fcc419]/10 border border-[#fcc419]/30 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-[#fcc419] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-[#e8eaf0]">当前展示的是演示数据，尚未接入影刀RPA真实采集</div>
                  <div className="text-xs text-[#8b92a8] mt-1">
                    你的RPA未运行，或未将采集记录推送至对接接口。一旦RPA开始推送，看板将自动显示最新实时数据。
                  </div>
                </div>
              </div>
              <Link
                to="/admin#rpa-docs"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-[#fcc419]/10 border border-[#fcc419]/30 text-[#fcc419] hover:bg-[#fcc419]/20 text-xs font-semibold transition-colors text-center"
              >
                查看影刀RPA对接文档
              </Link>
            </div>
          )}

          <KPICards posts={posts} />

          <div className="text-lg font-bold text-[#e8eaf0] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#ff4757] rounded-full" />
            核心洞察
            <span className="text-sm font-normal text-[#8b92a8]">基于数据的关键发现</span>
          </div>
          <Insights posts={posts} />

          <div className="text-lg font-bold text-[#e8eaf0] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#4dabf7] rounded-full" />
            数据可视化
            <span className="text-sm font-normal text-[#8b92a8]">点击图表标签切换视图</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <TrendChart posts={posts} />
            <TagDistributionChart posts={posts} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <SentimentChart posts={posts} />
            <TagDetailTable posts={posts} />
          </div>

          <div className="text-lg font-bold text-[#e8eaf0] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#fcc419] rounded-full" />
            热门帖子 TOP 10
            <span className="text-sm font-normal text-[#8b92a8]">按浏览量排序</span>
          </div>
          <TopPostsTable posts={posts} />

          <div className="text-lg font-bold text-[#e8eaf0] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#9775fa] rounded-full" />
            行动建议
            <span className="text-sm font-normal text-[#8b92a8]">基于数据的可落地方案</span>
          </div>
          <ActionPanel />

          <div className="text-center py-8 text-xs text-[#8b92a8]">
            <p>影刀社区数据分析看板 · 数据来源：社区帖子数据库</p>
            <p className="mt-1">
              {lastUpdated
                ? `最后更新时间：${lastUpdated.toLocaleString('zh-CN')} · 共分析 ${posts.length} 条有效帖子`
                : '数据加载中...'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
