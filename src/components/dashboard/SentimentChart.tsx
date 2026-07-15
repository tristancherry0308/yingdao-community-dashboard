import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { SENTIMENT_COLORS, SENTIMENT_LABELS, type Post, type SentimentType } from '@/types/dashboard';

export function SentimentChart({ posts }: { posts: Post[] }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const counts: Record<SentimentType, number> = { positive: 0, neutral: 0, negative: 0 };
  posts.forEach((p) => {
    counts[p.sentiment] = (counts[p.sentiment] || 0) + 1;
  });
  const total = posts.length;

  useEffect(() => {
    if (!chartRef.current) return;
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark');
    }

    const data = (Object.keys(counts) as SentimentType[]).map((key) => ({
      value: counts[key],
      name: SENTIMENT_LABELS[key],
      itemStyle: { color: SENTIMENT_COLORS[key] },
    }));

    const neutralRate = total > 0 ? ((counts.neutral / total) * 100).toFixed(1) : '0.0';

    const option: echarts.EChartsOption = {
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
          const key = (Object.keys(SENTIMENT_LABELS) as SentimentType[]).find(
            (k) => SENTIMENT_LABELS[k] === name
          );
          if (!key) return name;
          return `${name}  ${counts[key]}篇`;
        },
      },
      graphic: [
        {
          type: 'text',
          left: '25%',
          top: '42%',
          style: {
            text: `${neutralRate}%`,
            fill: '#8b92a8',
            fontSize: 28,
            fontWeight: 'bold',
          },
        },
        {
          type: 'text',
          left: '27%',
          top: '56%',
          style: {
            text: '中性',
            fill: '#8b92a8',
            fontSize: 12,
          },
        },
      ],
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: { show: false },
          data,
        },
      ],
    };

    chartInstance.current.setOption(option, true);
  }, [counts, total]);

  useEffect(() => {
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5">
      <div className="mb-4">
        <div className="text-[15px] font-semibold text-[#e8eaf0]">情感倾向分析</div>
        <div className="text-xs text-[#8b92a8]">极度理性·中性占比 {total > 0 ? ((counts.neutral / total) * 100).toFixed(1) : '0.0'}%</div>
      </div>
      <div ref={chartRef} className="h-[260px] w-full" />
    </div>
  );
}
