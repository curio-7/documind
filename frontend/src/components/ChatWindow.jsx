import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, BrainCircuit } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { streamChat } from '../api/client';

export default function ChatWindow({ documents }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('all');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: 'user', content: input.trim() };
    const initialAiMessage = { role: 'assistant', content: '', isTyping: true };
    
    setMessages((prev) => [...prev, userMessage, initialAiMessage]);
    setInput('');
    setIsStreaming(true);

    const docId = selectedDocId === 'all' ? null : selectedDocId;
    let accumulatedText = '';

    streamChat(
      userMessage.content,
      docId,
      (token) => {
        accumulatedText += token;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: accumulatedText,
            isTyping: false
          };
          return newMessages;
        });
      },
      () => {
        setIsStreaming(false);
      },
      (error) => {
        console.error('Chat error:', error);
        setIsStreaming(false);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: newMessages[newMessages.length - 1].content + '\n\n**Error:** Failed to get response.',
            isTyping: false
          };
          return newMessages;
        });
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <BrainCircuit size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">How can I help you today?</h2>
            <p className="text-slate-400 max-w-md">
              Ask me questions about your uploaded documents. I can summarize, extract information, or help you understand complex content.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage 
              key={idx} 
              message={msg} 
              isStreaming={isStreaming && idx === messages.length - 1} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-6 bg-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <div className="w-64">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Documents</option>
              {documents?.filter(d => d.status === 'COMPLETED').map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.fileName}
                </option>
              ))}
            </select>
          </div>
          
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your documents..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-4 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[56px] max-h-32"
              rows={1}
              style={{ fieldSizing: 'content' }} // modern CSS feature
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <SendHorizontal size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
