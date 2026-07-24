const ErrorBanner = ({ message }) => (
  <div className="mt-6 rounded-xl border border-red-700/40 bg-red-950/60 px-4 py-3 text-sm text-red-200">
    {message}
  </div>
);

export default ErrorBanner;
