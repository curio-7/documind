import SearchPanel from '../components/SearchPanel';

export default function SearchPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-3">Semantic Search</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Search across all your documents using AI-powered semantic understanding. 
          Find what you need even if you don't use the exact keywords.
        </p>
      </div>
      
      <SearchPanel />
    </div>
  );
}
