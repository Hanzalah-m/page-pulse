const ReportCard = ({ report, summaryRows }) => (
  <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold">Audit Report</h2>
        <p className="text-sm text-slate-400">{report.url}</p>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      {summaryRows.map((row) => (
        <div key={row.label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{row.label}</p>
          <p className="mt-1 text-sm font-medium text-slate-100">{row.value}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ReportCard;
