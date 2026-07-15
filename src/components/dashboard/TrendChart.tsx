import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Post } from '@/types/dashboard';

interface TrendChartProps {
  posts: Post[];
}

export function TrendChart({ posts }: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [viewType, setViewType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark');
    }

    const dateMap = new Map<string, number>();
    posts.forEach((post) => {
      dateMap.set(post.post_date, (dateMap.get(post.post_date) || 0) + 1);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    const values = sortedDates.map((date) => dateMap.get(date) || 0);
    const displayDates = sortedDates.map((d) => {
      const date = new Date(d);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      grid: { top: 20, right: 20, bottom: 30, left: 40 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1e2230',
        borderColor: '#2a2f3e',
        textStyle: { color: '#e8eaf0' },
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number }[];
          return `<div style="font-weight:600">${p[0].name}</div>帖子数: <strong>${p[0].value}</strong>篇`;
        },
      },
      xAxis: {
        type: 'category',
        data: displayDates,
        axisLine: { lineStyle: { color: '#2a2f3e' } },
        axisLabel: { color: '#8b92a8' },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#2a2f3e', type: 'dashed' } },
        axisLabel: { color: '#8b92a8' },
      },
      series: [
        {
          type: viewType,
          data: values,
          smooth: true,
          itemStyle: { color: '#ff4757', borderRadius: viewType === 'bar' ? 4 : 0 },
          lineStyle: { width: 3, color: '#ff4757' },
          areaStyle: viewType === 'line'
            ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(255,71,87,0.3)' },
                  { offset: 1, color: 'rgba(255,71,87,0)' },
                ]),
              }
            : undefined,
        },
      ],
    };

    chartInstance.current.setOption(option, true);
  }, [posts, viewType]);

  useEffect(() => {
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[15px] font-semibold text-[#e8eaf0]">每日活跃度趋势</div>
          <div className="text-xs text-[#8b92a8]">数据周期·工作日 vs 周末对比</div>
        </div>
        <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'line' | 'bar')}>
          <TabsList className="bg-[#0f1117] p-1">
            <TabsTrigger value="line" className="text-xs data-[state=active]:bg-[#1e2230]">趋势</TabsTrigger>
            <TabsTrigger value="bar" className="text-xs data-[state=active]:bg-[#1e2230]">柱状</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div ref={chartRef} className="h-[220px] w-full" />
    </div>
  );
}
