import { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import { getDocuments } from '../api/client';

export default function ChatPage() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getDocuments().then(setDocuments).catch(console.error);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex-shrink-0">
        <h1 className="text-xl font-semibold text-slate-100">Chat with your Documents</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatWindow documents={documents} />
      </div>
    </div>
  );
}
