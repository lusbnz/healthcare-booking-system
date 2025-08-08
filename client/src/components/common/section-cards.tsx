import { StatCard, StatCardProps } from "./stat-card";

interface SectionCardsProps {
  data: StatCardProps[];
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
     {data.map((item, idx) => (
        <StatCard key={idx} {...item} />
      ))}
    </div>
  );
}
