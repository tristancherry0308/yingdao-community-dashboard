import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TAG_COLORS, TAG_LABELS, type Post, type TagType } from '@/types/dashboard';

export function TagDistributionChart({ posts }: { posts: Post[] }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [viewType, setViewType] = useState<'bar' | 'pie'>('bar');

  const tagCounts: Record<TagType, number> = { T1: 0, T2: 0, T3: 0, T4: 0, T5: 0 };
  posts.forEach((p) => {
    tagCounts[p.tag] = (tagCounts[p.tag] || 0) + 1;
  });

  const sortedTags = (Object.keys(tagCounts) as TagType[]).sort((a, b) => tagCounts[b] - tagCounts[a]);
  const total = posts.length;

  useEffect(() => {
    if (!chartRef.current) return;
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark');
    }

    const labels = sortedTags.map((t) => `${t} ${TAG_LABELS[t]}`);
    const values = sortedTags.map((t) => tagCounts[t]);
    const colors = sortedTags.map((t) => TAG_COLORS[t]);

    let option: echarts.EChartsOption;

    if (viewType === 'bar') {
      option = {
        backgroundColor: 'transparent',
        grid: { top: 10, right: 80, bottom: 20, left: 100 },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#1e2230',
          borderColor: '#2a2f3e',
          textStyle: { color: '#e8eaf0' },
          formatter: (params: unknown) => {
            const p = params as { name: string; value: number }[];
            const percent = total > 0 ? ((p[0].value / total) * 100).toFixed(1) : '0.0';
            return `<div style="font-weight:600">${p[0].name}</div>数量: <strong>${p[0].value}</strong> 篇<br/>占比: <strong>${percent}%</strong>`;
          },
        },
        xAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: '#2a2f3e', type: 'dashed' } },
          axisLabel: { color: '#8b92a8' },
        },
        yAxis: {
          type: 'category',
          data: labels,
          axisLine: { lineStyle: { color: '#2a2f3e' } },
          axisLabel: { color: '#8b92a8' },
        },
        series: [
          {
            type: 'bar',
            data: values.map((v, i) => ({ value: v, itemStyle: { color: colors[i], borderRadius: 4 } })),
            label: {
              show: true,
              position: 'right',
              color: '#e8eaf0',
              formatter: (params: unknown) => {
                const p = params as { value: number };
                const percent = total > 0 ? ((Number(p.value) / total) * 100).toFixed(1) : '0.0';
                return `${p.value}篇  ${percent}%`;
              },
            },
          },
        ],
      };
    } else {
      option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: '#1e2230',
          borderColor: '#2a2f3e',
          textStyle: { color: '#e8eaf0' },
          formatter: (params: unknown) => {
            const p = params as { name: string; value: number; percent: number };
            return `<div style="font-weight:600">${p.name}</div>数量: <strong>${p.value}</strong>篇<br/>占比: <strong>${p.percent}%</strong>`;
          },
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: { color: '#8b92a8' },
          formatter: (name: string) => {
            const t = name.split(' ')[0] as TagType;
            return `${TAG_LABELS[t]}  ${tagCounts[t]}篇`;
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            label: { show: false },
            data: sortedTags.map((t) => ({
              value: tagCounts[t],
              name: `${t} ${TAG_LABELS[t]}`,
              itemStyle: { color: TAG_COLORS[t] },
            })),
          },
        ],
      };
    }

    chartInstance.current.setOption(option, true);
  }, [posts, viewType, sortedTags, tagCounts, total]);

  useEffect(() => {
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[15px] font-semibold text-[#e8eaf0]">问题类型分布</div>
          <div className="text-xs text-[#8b92a8]">5大类别·功能咨询居首</div>
        </div>
        <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'bar' | 'pie')}>
          <TabsList className="bg-[#0f1117] p-1">
            <TabsTrigger value="bar" className="text-xs data-[state=active]:bg-[#1e2230]">柱状</TabsTrigger>
            <TabsTrigger value="pie" className="text-xs data-[state=active]:bg-[#1e2230]">环形</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div ref={chartRef} className="h-[260px] w-full" />
    </div>
  );
}
