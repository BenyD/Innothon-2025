import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  loading?: boolean;
  subtitle?: string;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-36 mt-2" />
        </div>
        <Skeleton className="h-14 w-14 rounded-lg" />
      </div>
    </div>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
  subtitle,
}: StatCardProps) {
  if (loading) return <StatCardSkeleton />;

  // Format large numbers with commas
  const formattedValue =
    typeof value === "number" && value >= 1000
      ? value.toLocaleString("en-IN")
      : value;

  return (
    <div className="relative group h-full">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative h-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
          <div className={`p-2.5 rounded-lg bg-white/5 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div>
          <div className="text-2xl font-bold">{formattedValue}</div>
          {subtitle && (
            <div className="text-sm text-gray-400 mt-1">{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}
