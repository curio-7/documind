const API_BASE = '/api';

// Document APIs
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/documents`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function deleteDocument(id) {
  const res = await fetch(`${API_BASE}/documents/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete document');
}

// Chat API (blocking)
export async function sendChat(question, documentId = null) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, documentId }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json();
}

// Chat Streaming API (SSE)
export function streamChat(question, documentId, onToken, onDone, onError) {
  fetch(`${API_BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, documentId }),
  }).then(response => {
    if (!response.body) throw new Error('ReadableStream not supported');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    function read() {
      reader.read().then(({ done, value }) => {
        if (done) { onDone(); return; }
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (data === '[DONE]') { onDone(); return; }
            if (data) onToken(data);
          }
        }
        read();
      }).catch(onError);
    }
    read();
  }).catch(onError);
}

// Search API
export async function semanticSearch(query, maxResults = 5) {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, maxResults }),
  });
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}
