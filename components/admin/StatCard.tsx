function StatCard({ title, value, icon: Icon, color, loading }: StatCardProps) {
  if (loading) return <StatCardSkeleton />;
  
  return (
    <div className="relative group h-full">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative h-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 lg:p-6 hover:border-white/20 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-gray-400 text-sm truncate">{title}</p>
            <p className="text-xl lg:text-2xl font-bold text-white mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg bg-white/5 flex-shrink-0 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
} 