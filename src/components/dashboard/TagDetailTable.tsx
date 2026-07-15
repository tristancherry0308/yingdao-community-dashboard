import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TAG_COLORS, TAG_LABELS, type Post, type TagType } from '@/types/dashboard';

export function TagDetailTable({ posts }: { posts: Post[] }) {
  const tagCounts: Record<TagType, number> = { T1: 0, T2: 0, T3: 0, T4: 0, T5: 0 };
  posts.forEach((p) => {
    tagCounts[p.tag] = (tagCounts[p.tag] || 0) + 1;
  });

  const sortedTags = (Object.keys(tagCounts) as TagType[]).sort((a, b) => tagCounts[b] - tagCounts[a]);
  const total = posts.length;

  const priorityClass = (rank: number) => {
    if (rank === 0) return { text: '高', color: '#ff4757' };
    if (rank <= 2) return { text: '中', color: '#fcc419' };
    return { text: '低', color: '#51cf66' };
  };

  return (
    <div className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-5">
      <div className="mb-4">
        <div className="text-[15px] font-semibold text-[#e8eaf0]">问题类型详细拆解</div>
        <div className="text-xs text-[#8b92a8]">点击表头可查看排名</div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2a2f3e] hover:bg-transparent">
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">类型</TableHead>
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">数量</TableHead>
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">占比</TableHead>
              <TableHead className="text-[#8b92a8] text-[11px] uppercase tracking-wider">优先级</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTags.map((tag, index) => {
              const count = tagCounts[tag];
              const percent = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
              const priority = priorityClass(index);
              return (
                <TableRow key={tag} className="border-[#2a2f3e] hover:bg-[#0f1117]">
                  <TableCell className="py-3">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold"
                      style={{ backgroundColor: `${TAG_COLORS[tag]}12`, color: TAG_COLORS[tag] }}
                    >
                      {tag} {TAG_LABELS[tag]}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-[#e8eaf0] font-semibold">{count}</TableCell>
                  <TableCell className="py-3 text-[#8b92a8]">{percent}%</TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-semibold" style={{ color: priority.color }}>
                      {priority.text}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
