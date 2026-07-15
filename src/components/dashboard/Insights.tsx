import { type Post, type TagType, TAG_LABELS } from '@/types/dashboard';

interface InsightsProps {
  posts: Post[];
}

export function Insights({ posts }: InsightsProps) {
  const total = posts.length;

  // 帖子最多的标签分类
  const tagCounts: Record<string, number> = {};
  posts.forEach((p) => {
    tagCounts[p.tag] = (tagCounts[p.tag] || 0) + 1;
  });
  const topTagEntry = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
  const topTag = topTagEntry ? (topTagEntry[0] as TagType) : 'T5';
  const topTagCount = topTagEntry ? topTagEntry[1] : 0;
  const topTagPercent = total > 0 ? ((topTagCount / total) * 100).toFixed(1) : '0.0';

  // 发帖最多的星期几
  const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekdayCounts: Record<string, number> = {};
  posts.forEach((p) => {
    const day = weekdayNames[new Date(p.post_date).getDay()];
    weekdayCounts[day] = (weekdayCounts[day] || 0) + 1;
  });
  const topWeekdayEntry = Object.entries(weekdayCounts).sort((a, b) => b[1] - a[1])[0];
  const topWeekday = topWeekdayEntry ? topWeekdayEntry[0] : '-';
  const topWeekdayCount = topWeekdayEntry ? topWeekdayEntry[1] : 0;

  // 情感占比最高
  const sentimentCounts: Record<string, number> = {};
  posts.forEach((p) => {
    sentimentCounts[p.sentiment] = (sentimentCounts[p.sentiment] || 0) + 1;
  });
  const topSentimentEntry = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0];
  const sentimentLabelMap: Record<string, string> = {
    positive: '积极',
    neutral: '中性',
    negative: '消极',
  };
  const topSentiment = topSentimentEntry ? sentimentLabelMap[topSentimentEntry[0]] : '-';
  const topSentimentPercent = topSentimentEntry && total > 0
    ? ((topSentimentEntry[1] / total) * 100).toFixed(1)
    : '0.0';

  const insights = [
    {
      badge: '核心痛点',
      badgeColor: 'red',
      title: `${TAG_LABELS[topTag]}是最大类别`,
      desc: `${topTagCount}篇${TAG_LABELS[topTag]}帖子占比${topTagPercent}%，是当前社区讨论最多的话题。建议针对性地提供解决方案和最佳实践。`,
      metric: `${topTagPercent}%`,
      cardColor: 'red-insight',
    },
    {
      badge: '趋势信号',
      badgeColor: 'blue',
      title: `${topWeekday}发帖最为活跃`,
      desc: `${topWeekday}共有${topWeekdayCount}篇帖子，是社区互动的高峰日。建议在该日增派运营和技术支持力量，确保及时响应用户问题。`,
      metric: `${topWeekdayCount}篇`,
      cardColor: 'blue-insight',
    },
    {
      badge: '周期规律',
      badgeColor: 'green',
      title: `${topSentiment}情感占比最高`,
      desc: `社区整体情感以${topSentiment}为主，占比${topSentimentPercent}%。可以借助此特征分析用户情绪变化，及时调整内容运营策略。`,
      metric: `${topSentimentPercent}%`,
      cardColor: 'green-insight',
    },
  ];

  const badgeColorClasses: Record<string, string> = {
    red: 'bg-[#ff4757]/10 text-[#ff4757]',
    blue: 'bg-[#4dabf7]/10 text-[#4dabf7]',
    green: 'bg-[#51cf66]/10 text-[#51cf66]',
  };

  const metricColorMap: Record<string, string> = {
    'red-insight': '#ff4757',
    'blue-insight': '#4dabf7',
    'green-insight': '#51cf66',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`relative bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5 overflow-hidden`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className="absolute top-0 left-5 w-10 h-[3px] rounded-b-sm"
            style={{ backgroundColor: metricColorMap[insight.cardColor] }}
          />
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold mb-3 ${badgeColorClasses[insight.badgeColor]}`}>
            {insight.badge}
          </div>
          <div className="text-[15px] font-bold text-[#e8eaf0] mb-2">{insight.title}</div>
          <div className="text-[13px] text-[#8b92a8] leading-relaxed">{insight.desc}</div>
          <div className="mt-3 text-2xl font-extrabold" style={{ color: metricColorMap[insight.cardColor] }}>
            {insight.metric}
          </div>
        </div>
      ))}
    </div>
  );
}
