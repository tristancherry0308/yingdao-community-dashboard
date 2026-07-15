const actions = [
  {
    num: 1,
    title: '周一技术支持增配',
    desc: '周一帖子数通常高于周末，建议建立"周一快速响应通道"，增派值班人力，确保2小时内首响。',
  },
  {
    num: 2,
    title: '引入AI智能助手',
    desc: '功能咨询占比较高时，说明社区从"纠错中心"向"学习平台"转变。优化FAQ文档，引入AI助手前置解答，降低人工回复成本。',
  },
  {
    num: 3,
    title: '攻克网页交互难题',
    desc: '网页交互异常帖反映动态加载、iframe、影子节点等复杂场景挑战。建议推出"深度探测"功能自动识别。',
  },
  {
    num: 4,
    title: '建立兼容性知识库',
    desc: '第三方对接问题涉及微信、钉钉、SAP等。汇总避坑指南，定期发布兼容性更新公告。',
  },
  {
    num: 5,
    title: '激活社区情感连接',
    desc: '积极情感较低时，策划"成功案例分享"和"自动化达人挑战赛"，打破"有问题才来"的循环。',
  },
  {
    num: 6,
    title: '消极帖子100%回溯',
    desc: '消极帖数量不多但代表极度受阻体验。建立"负面情绪快速响应SLA"，24小时内提供解决方案。',
  },
];

export function ActionPanel() {
  return (
    <div className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-6">
      <div className="flex items-center gap-2 text-base font-bold text-[#e8eaf0] mb-4">
        <span className="text-[#ff4757]">■</span>
        优先级行动清单
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((action) => (
          <div
            key={action.num}
            className="flex items-start gap-3 p-4 bg-[#0f1117] rounded-xl border border-transparent hover:border-[#ff4757]/50 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#ff4757]/10 text-[#ff4757] flex items-center justify-center text-[13px] font-bold shrink-0">
              {action.num}
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#e8eaf0] mb-1">{action.title}</div>
              <div className="text-xs text-[#8b92a8] leading-relaxed">{action.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
