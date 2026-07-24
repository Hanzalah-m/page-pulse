const UrlForm = ({ url, setUrl, onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-3 md:flex-row">
    <input
      value={url}
      onChange={(event) => setUrl(event.target.value)}
      placeholder="https://example.com"
      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
      required
    />
    <button
      type="submit"
      disabled={loading}
      className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Auditing…' : 'Audit Website'}
    </button>
  </form>
);

export default UrlForm;
