const LoadingSpinner = () => (
  <div className="mt-6 flex items-center gap-3 text-sm text-cyan-300">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
    <span>Auditing website…</span>
  </div>
);

export default LoadingSpinner;
