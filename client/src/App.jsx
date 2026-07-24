import { useMemo, useState } from 'react';
import { auditWebsite } from './api/auditClient';
import ErrorBanner from './components/ErrorBanner';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ReportCard from './components/ReportCard';
import UrlForm from './components/UrlForm';

const App = () => {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setReport(null);
    setLoading(true);

    try {
      const response = await auditWebsite(url);
      setReport(response);
    } catch (err) {
      setError(err.message || 'Unable to audit the website.');
    } finally {
      setLoading(false);
    }
  };

  const summaryRows = useMemo(() => {
    if (!report) return [];
    return [
      { label: 'Status', value: report.status },
      { label: 'Response Time', value: `${report.responseTime} ms` },
      { label: 'Title', value: report.title || '—' },
      { label: 'Meta Description', value: report.metaDescription || '—' },
      { label: 'H1 Count', value: report.h1Count },
      { label: 'Images Missing Alt', value: report.imagesMissingAlt },
      { label: 'Word Count', value: report.wordCount }
    ];
  }, [report]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-between px-6 py-10">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <div className="mb-8 space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Page Pulse</p>
            <h1 className="text-4xl font-semibold">Audit any public website in seconds</h1>
            <p className="max-w-2xl text-slate-400">
              Send a URL to the backend, inspect title and metadata, and spot missing alt text and basic SEO structure.
            </p>
          </div>

          <UrlForm url={url} setUrl={setUrl} onSubmit={handleSubmit} loading={loading} />

          {loading && <LoadingSpinner />}
          {error && <ErrorBanner message={error} />}
          {report && <ReportCard report={report} summaryRows={summaryRows} />}
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default App;
