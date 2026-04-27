export function ResultsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-12 pb-24 animate-pulse">
      <div className="h-3 w-24 bg-primary/20 rounded mb-3" />
      <div className="h-8 w-2/3 bg-white/10 rounded mb-2" />
      <div className="h-3 w-1/3 bg-white/5 rounded mb-10" />
      <div className="grid lg:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass-strong rounded-3xl p-8 h-72 flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border-8 border-primary/20 border-t-primary animate-spin-slow" />
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-12">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-6 h-44">
            <div className="h-4 w-1/2 bg-white/10 rounded mb-3" />
            <div className="h-3 w-full bg-white/5 rounded mb-2" />
            <div className="h-3 w-5/6 bg-white/5 rounded" />
          </div>
        ))}
      </div>
      <style>{`@keyframes spin-slow { to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 2.5s linear infinite; }`}</style>
    </div>
  );
}
