import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import DocumentUpload from '../components/DocumentUpload';
import DocumentList from '../components/DocumentList';
import { getDocuments } from '../api/client';

export default function DashboardPage() {
  const [documents, setDocuments] = useState([]);
  
  const fetchDocs = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchDocs();
    const interval = setInterval(() => {
      // Auto refresh for processing status
      fetchDocs();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Documents', value: documents.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: documents.filter(d => d.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Processing', value: documents.filter(d => d.status === 'PROCESSING').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Failed', value: documents.filter(d => d.status === 'FAILED').length, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
        <p className="text-slate-400">Manage your documents and view processing status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-200">Upload New Document</h2>
        <DocumentUpload onUploadComplete={fetchDocs} />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-200">Your Documents</h2>
        <DocumentList 
          documents={documents} 
          onDelete={fetchDocs} 
          onRefresh={fetchDocs} 
        />
      </div>
    </div>
  );
}
