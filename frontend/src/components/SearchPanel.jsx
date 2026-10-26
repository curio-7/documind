import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { semanticSearch } from '../api/client';
import LoadingSpinner from './LoadingSpinner';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await semanticSearch(query);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg transition-shadow"
            placeholder="Search across your documents..."
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute inset-y-2 right-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" text="Searching documents..." />
        </div>
      ) : hasSearched ? (
        results.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-slate-400 text-sm font-medium px-1 mb-4">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </h3>
            {results.map((result, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                    <FileText size={16} />
                    <span>{result.documentName || 'Unknown Document'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${result.score > 0.8 ? 'bg-green-500' : result.score > 0.6 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                        style={{ width: `${(result.score * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {(result.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {result.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-1">No results found</h3>
            <p className="text-slate-500">Try adjusting your search query to be more general.</p>
          </div>
        )
      ) : null}
    </div>
  );
}
