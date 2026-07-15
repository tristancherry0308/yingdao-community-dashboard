import { useEffect, useState } from 'react';
import { Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  lastUpdated: Date | null;
  isDemoData?: boolean;
}

export function Header({ lastUpdated, isDemoData = false }: HeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dateRangeText = isDemoData
    ? '数据来源：示例数据（供调试展示）'
    : '数据来源：影刀社区问答界面·RPA自动采集';
  const syncStatusText = isDemoData ? '示例数据' : '数据已同步';
  const syncStatusColor = isDemoData ? '#fcc419' : '#51cf66';
  const updateText = lastUpdated
    ? `最后更新：${lastUpdated.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })}`
    : '数据加载中...';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-[#2a2f3e] mb-6 gap-4">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-[#ff4757] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,71,87,0.15)]">
          <Activity size={24} className="text-[#0f1117]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#e8eaf0]">影刀社区数据看板</h1>
          <p className="text-[13px] text-[#8b92a8] mt-0.5">{dateRangeText}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/admin"
          className="px-3 py-1.5 rounded-lg bg-[#0f1117] border border-[#2a2f3e] text-[#8b92a8] hover:text-[#e8eaf0] hover:border-[#ff4757]/50 text-xs font-medium transition-colors"
        >
          数据管理
        </Link>
        <div className="flex items-center gap-2 bg-[#161922] border border-[#2a2f3e] px-3 py-1.5 rounded-full text-xs text-[#8b92a8]">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: syncStatusColor }} />
          {syncStatusText}
        </div>
        <div className="flex items-center gap-2 bg-[#161922] border border-[#2a2f3e] px-3 py-1.5 rounded-lg text-xs text-[#8b92a8]">
          <Calendar size={12} />
          {now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#161922] border border-[#2a2f3e] px-3 py-1.5 rounded-lg text-xs text-[#8b92a8]">
          {updateText}
        </div>
      </div>
    </div>
  );
}
