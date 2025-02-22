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
    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32 mt-1" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
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

  return (
    <div className="relative group h-full">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative h-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 lg:p-6 hover:border-white/20 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className={`p-2 sm:p-3 rounded-lg bg-white/5 flex-shrink-0 ${color}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-gray-400 truncate">{title}</p>
            <div className="mt-1">
              <div className="text-lg sm:text-2xl font-semibold truncate">{value}</div>
              {subtitle && (
                <div className="text-xs sm:text-sm text-gray-400 truncate">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
