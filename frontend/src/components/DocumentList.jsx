import { FileText, Trash2 } from 'lucide-react';
import { deleteDocument } from '../api/client';

export default function DocumentList({ documents, onDelete, onRefresh }) {
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteDocument(id);
      if (onDelete) onDelete();
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-8 text-center border border-slate-800">
        <FileText size={48} className="mx-auto text-slate-600 mb-4" />
        <p className="text-slate-400">No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Document Name</th>
              <th className="px-6 py-4 font-medium">Size</th>
              <th className="px-6 py-4 font-medium">Pages</th>
              <th className="px-6 py-4 font-medium">Chunks</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                  <FileText size={18} className="text-blue-500" />
                  <span className="truncate max-w-[200px]" title={doc.filename}>{doc.filename}</span>
                </td>
                <td className="px-6 py-4">{formatSize(doc.fileSize)}</td>
                <td className="px-6 py-4">{doc.pageCount || '-'}</td>
                <td className="px-6 py-4">{doc.chunkCount || '-'}</td>
                <td className="px-6 py-4">
                  {doc.status === 'COMPLETED' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                      Completed
                    </span>
                  )}
                  {doc.status === 'PROCESSING' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                      Processing...
                    </span>
                  )}
                  {doc.status === 'FAILED' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                      Failed
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">{new Date(doc.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-slate-800"
                    title="Delete document"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
