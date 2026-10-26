import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400 border border-slate-700'
        }`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
      </div>
      
      <div className={`flex-1 min-w-0 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`inline-block p-4 rounded-2xl max-w-full ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-sm'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-body">
              {message.content ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                message.isTyping && (
                  <div className="flex space-x-1 h-5 items-center px-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full typing-dot"></div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
