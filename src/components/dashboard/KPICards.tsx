import { FileText, TrendingUp, MessageSquare, Globe, Minus } from 'lucide-react';
import type { Post, TagType } from '@/types/dashboard';
import { TAG_COLORS, TAG_LABELS } from '@/types/dashboard';

interface KPICardsProps {
  posts: Post[];
}

interface KPICard {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  color: string;
  isTrendUp?: boolean | null;
}

export function KPICards({ posts }: KPICardsProps) {
  const total = posts.length;
  const maxViews = posts.length > 0 ? Math.max(...posts.map((p) => p.views)) : 0;

  const tagCounts: Record<TagType, number> = { T1: 0, T2: 0, T3: 0, T4: 0, T5: 0 };
  posts.forEach((p) => {
    tagCounts[p.tag] = (tagCounts[p.tag] || 0) + 1;
  });

  const topTag = (Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'T5') as TagType;

  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  posts.forEach((p) => {
    sentimentCounts[p.sentiment] = (sentimentCounts[p.sentiment] || 0) + 1;
  });
  const neutralRate = total > 0 ? ((sentimentCounts.neutral / total) * 100).toFixed(1) : '0.0';

  const cards: KPICard[] = [
    {
      id: 'kpi-total',
      icon: <FileText size={18} />,
      label: '总帖子数',
      value: total.toString(),
      trend: '实时统计',
      color: '#ff4757',
      isTrendUp: true,
    },
    {
      id: 'kpi-peak',
      icon: <TrendingUp size={18} />,
      label: '最高浏览量',
      value: maxViews.toString(),
      trend: '热门帖子',
      color: '#4dabf7',
      isTrendUp: true,
    },
    {
      id: 'kpi-top-tag',
      icon: <MessageSquare size={18} />,
      label: `${TAG_LABELS[topTag]} 帖`,
      value: tagCounts[topTag].toString(),
      trend: total > 0 ? `占比 ${((tagCounts[topTag] / total) * 100).toFixed(1)}%` : '占比 0.0%',
      color: TAG_COLORS[topTag],
      isTrendUp: null,
    },
    {
      id: 'kpi-web',
      icon: <Globe size={18} />,
      label: '网页交互异常',
      value: tagCounts.T1.toString(),
      trend: total > 0 ? `占比 ${((tagCounts.T1 / total) * 100).toFixed(1)}%` : '占比 0.0%',
      color: '#fcc419',
      isTrendUp: false,
    },
    {
      id: 'kpi-neutral',
      icon: <Minus size={18} />,
      label: '情感中性率',
      value: `${neutralRate}%`,
      trend: '理性讨论氛围',
      color: '#9775fa',
      isTrendUp: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="group relative bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ backgroundColor: card.color }}
          />
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3"
            style={{ backgroundColor: `${card.color}15`, color: card.color }}
          >
            {card.icon}
          </div>
          <div className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: card.color }}>
            {card.value}
          </div>
          <div className="text-[13px] text-[#8b92a8] mb-2">{card.label}</div>
          {card.trend && (
            <div
              className={`text-xs flex items-center gap-1 ${
                card.isTrendUp === true ? 'text-[#51cf66]' : card.isTrendUp === false ? 'text-[#ff4757]' : 'text-[#8b92a8]'
              }`}
            >
              {card.isTrendUp === true && '↑ '}
              {card.isTrendUp === false && '⚠ '}
              {card.trend}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
