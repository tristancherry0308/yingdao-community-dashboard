import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TAG_LABELS, type TagType, type SentimentType } from '@/types/dashboard';

export interface FilterState {
  startDate: string;
  endDate: string;
  tags: TagType[];
  sentiments: SentimentType[];
}

interface DashboardFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const ALL_TAGS: TagType[] = ['T1', 'T2', 'T3', 'T4', 'T5'];
const ALL_SENTIMENTS: SentimentType[] = ['positive', 'neutral', 'negative'];

export function DashboardFilters({ filters, onChange, onRefresh, isLoading }: DashboardFiltersProps) {
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : subDays(new Date(), 7)
  );
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : new Date()
  );

  useEffect(() => {
    setStartDateObj(filters.startDate ? new Date(filters.startDate) : subDays(new Date(), 7));
    setEndDateObj(filters.endDate ? new Date(filters.endDate) : new Date());
  }, [filters.startDate, filters.endDate]);

  const updateDateRange = (start?: Date, end?: Date) => {
    onChange({
      ...filters,
      startDate: start ? format(start, 'yyyy-MM-dd') : '',
      endDate: end ? format(end, 'yyyy-MM-dd') : '',
    });
  };

  const toggleTag = (tag: TagType) => {
    const next = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag];
    onChange({ ...filters, tags: next });
  };

  const toggleSentiment = (sentiment: SentimentType) => {
    const next = filters.sentiments.includes(sentiment)
      ? filters.sentiments.filter((s) => s !== sentiment)
      : [...filters.sentiments, sentiment];
    onChange({ ...filters, sentiments: next });
  };

  const resetFilters = () => {
    const start = subDays(new Date(), 7);
    const end = new Date();
    setStartDateObj(start);
    setEndDateObj(end);
    onChange({
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
      tags: [],
      sentiments: [],
    });
  };

  return (
    <div className="bg-[#161922] border border-[#2a2f3e] rounded-2xl p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2 text-[#e8eaf0] font-semibold text-sm">
          <Filter size={16} className="text-[#ff4757]" />
          筛选条件
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#0f1117] border-[#2a2f3e] text-[#e8eaf0] hover:bg-[#1e2230] hover:text-[#e8eaf0] text-xs h-9"
              >
                <CalendarIcon size={14} className="mr-2 text-[#8b92a8]" />
                {filters.startDate && filters.endDate ? (
                  <>
                    {filters.startDate} — {filters.endDate}
                  </>
                ) : (
                  '选择日期范围'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#161922] border-[#2a2f3e]" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: startDateObj,
                  to: endDateObj,
                }}
                onSelect={(range) => {
                  const start = range?.from;
                  const end = range?.to;
                  setStartDateObj(start);
                  setEndDateObj(end);
                  if (start && end) {
                    updateDateRange(start, end);
                  }
                }}
                numberOfMonths={1}
                className="bg-[#161922] text-[#e8eaf0]"
              />
            </PopoverContent>
          </Popover>

          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors',
                  filters.tags.includes(tag)
                    ? 'bg-[#ff4757]/10 border-[#ff4757]/50 text-[#ff4757]'
                    : 'bg-[#0f1117] border-[#2a2f3e] text-[#8b92a8] hover:border-[#ff4757]/30'
                )}
              >
                {tag} {TAG_LABELS[tag]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_SENTIMENTS.map((sentiment) => {
              const labels: Record<string, string> = { positive: '积极', neutral: '中性', negative: '消极' };
              return (
                <button
                  key={sentiment}
                  onClick={() => toggleSentiment(sentiment)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors',
                    filters.sentiments.includes(sentiment)
                      ? 'bg-[#4dabf7]/10 border-[#4dabf7]/50 text-[#4dabf7]'
                      : 'bg-[#0f1117] border-[#2a2f3e] text-[#8b92a8] hover:border-[#4dabf7]/30'
                  )}
                >
                  {labels[sentiment]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="bg-[#0f1117] border-[#2a2f3e] text-[#8b92a8] hover:text-[#e8eaf0] hover:bg-[#1e2230] text-xs"
          >
            <RotateCcw size={14} className="mr-1" />
            重置
          </Button>
          <Button
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="bg-[#ff4757] text-[#0f1117] hover:bg-[#ff6b81] text-xs font-semibold"
          >
            <RotateCcw size={14} className={cn('mr-1', isLoading && 'animate-spin')} />
            立即刷新
          </Button>
        </div>
      </div>

      {(filters.tags.length > 0 || filters.sentiments.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#2a2f3e]">
          <span className="text-xs text-[#8b92a8]">已选筛选:</span>
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30">
              {TAG_LABELS[tag]}
            </Badge>
          ))}
          {filters.sentiments.map((sentiment) => {
            const labels: Record<string, string> = { positive: '积极', neutral: '中性', negative: '消极' };
            return (
              <Badge key={sentiment} variant="secondary" className="bg-[#4dabf7]/10 text-[#4dabf7] border-[#4dabf7]/30">
                {labels[sentiment]}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
