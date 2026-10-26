# DocuMind — AI Document Intelligence Platform

DocuMind is an enterprise-grade, privacy-first Retrieval-Augmented Generation (RAG) system that transforms unstructured PDF documents into intelligent conversational knowledge bases. Powered entirely on-premise/locally using **Spring Boot 3**, **LangChain4j**, **Ollama**, **PostgreSQL + pgvector**, and a modern **React + Vite** frontend.

---

## 🚀 Tech Stack

- **Backend Framework:** [Spring Boot 3.3](https://spring.io/projects/spring-boot) (Java 21)
- **AI / LLM Orchestration:** [LangChain4j 0.35+](https://github.com/langchain4j/langchain4j)
- **Local LLM & Embeddings:** [Ollama](https://ollama.ai/) (`llama3.2` for Chat, `nomic-embed-text` for 768-dim embeddings)
- **Vector Database:** [PostgreSQL 17](https://www.postgresql.org/) with [`pgvector`](https://github.com/pgvector/pgvector)
- **Document Ingestion & Parsing:** Apache PDFBox / LangChain4j Document Parsers
- **Frontend UI:** [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Containerization:** Docker & Docker Compose

---

## 🏛 Architecture Overview

```
                        ┌────────────────────────────────────────────────────────┐
                        │                   DocuMind Frontend                    │
                        │           (React 18 + Vite + Tailwind CSS)             │
                        └───────────────────────┬────────────────────────────────┘
                                                │ REST / SSE Stream
                                                ▼
                        ┌────────────────────────────────────────────────────────┐
                        │                   DocuMind Backend                     │
                        │               (Spring Boot 3 + Java 21)                │
                        │                                                        │
                        │  ┌──────────────────────┐   ┌───────────────────────┐  │
                        │  │ Document Ingestion   │   │ LangChain4j RAG Engine│  │
                        │  │ (PDFBox, Splitter)   │   │ (Retriever, Prompts)  │  │
                        │  └──────────┬───────────┘   └───────────┬───────────┘  │
                        └─────────────┼───────────────────────────┼──────────────┘
                                      │                           │
                   Embeddings (768-d) │                           │ Inference / Prompts
                                      ▼                           ▼
                        ┌────────────────────────┐   ┌───────────────────────────┐
                        │  PostgreSQL + pgvector │   │          Ollama           │
                        │   - Document Metadata  │   │ - llama3.2 (Chat)         │
                        │   - Vector Embeddings  │   │ - nomic-embed-text (Embed)│
                        └────────────────────────┘   └───────────────────────────┘
```

1. **Ingestion Pipeline:** PDFs are uploaded to the backend, parsed with Apache PDFBox, divided into overlapping semantic chunks, embedded using `nomic-embed-text`, and stored in PostgreSQL with pgvector cosine indexes.
2. **RAG Conversational Engine:** User queries are embedded into vector space, matched against the most relevant document chunks via cosine similarity, augmented into system prompts, and streamed as Server-Sent Events (SSE) from `llama3.2`.

---

## 📋 Prerequisites

- **Docker Desktop** installed and running
- **System Memory:** 8GB RAM minimum (16GB recommended for smooth local LLM inference)
- **Disk Space:** ~6GB free space for model weights (`llama3.2` ~2.0GB, `nomic-embed-text` ~274MB)
- **OS:** macOS (Apple Silicon / Intel), Linux, or Windows (WSL2)

---

## ⚡ Quick Start

### 1. Clone and Navigate to the Repository
```bash
git clone <repo-url> documind
cd documind
```

### 2. Launch the Stack with Docker Compose
```bash
docker compose up -d
```

### 3. Automatic Model Initialization
On first startup, the `ollama-pull` service automatically downloads:
- `llama3.2` (Chat model)
- `nomic-embed-text` (Embedding model)

*Note: First-time model download takes approximately 3–7 minutes depending on your internet speed.*

You can monitor initialization progress via:
```bash
docker compose logs -f ollama-pull
```

### 4. Access the Application
Once all containers report healthy:
- **Web Interface:** [http://localhost:5173](http://localhost:5173)
- **Backend API / Swagger / Actuator:** [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
- **Ollama Engine:** [http://localhost:11434](http://localhost:11434)
- **PostgreSQL Vector DB:** `localhost:5432` (`documind` / `documind_secret`)

---

## 🔌 API Endpoints

### Documents API (`/api/documents`)

| Method | Endpoint | Description | Request Body / Params | Response |
|---|---|---|---|---|
| `POST` | `/api/documents/upload` | Upload & ingest PDF file | `multipart/form-data` (`file`) | `DocumentDTO` (id, status, pageCount, chunkCount) |
| `GET` | `/api/documents` | List all uploaded documents | None | `List<DocumentDTO>` |
| `GET` | `/api/documents/{id}` | Get metadata for specific document | Path variable `id` (UUID) | `DocumentDTO` |
| `DELETE` | `/api/documents/{id}` | Delete document and vector chunks | Path variable `id` (UUID) | `204 No Content` |

### Chat & Intelligence API (`/api/chat`)

| Method | Endpoint | Description | Request Body / Params | Response |
|---|---|---|---|---|
| `POST` | `/api/chat` | Send question and stream RAG response | `{"query": "string", "documentId": "optional-uuid"}` | `text/event-stream` (SSE tokens) |
| `GET` | `/api/chat/history` | Retrieve current conversation history | None | `List<ChatMessageDTO>` |
| `POST` | `/api/chat/clear` | Clear active conversation memory | None | `200 OK` |

### Health & Monitoring

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/actuator/health` | Service health status including DB and LLM connectivity |
| `GET` | `/actuator/info` | Application build & runtime info |

---

## ⚙️ Configuration (`.env`)

All configurable properties are managed through the `.env` file:

```dotenv
# PostgreSQL Settings
POSTGRES_USER=documind
POSTGRES_PASSWORD=documind_secret
POSTGRES_DB=documind
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Spring Datasource Settings
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/documind
SPRING_DATASOURCE_USERNAME=documind
SPRING_DATASOURCE_PASSWORD=documind_secret

# Ollama LLM & Embedding Settings
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_CHAT_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text

# Embedding Configuration
EMBEDDING_DIMENSION=768

# File Upload Limits
SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE=50MB
SPRING_SERVLET_MULTIPART_MAX_REQUEST_SIZE=50MB
```

---

## 💻 Local Development Setup

To run services individually for active development:

### 1. Start Infrastructure Only
```bash
docker compose up -d postgres ollama ollama-pull
```

### 2. Run Backend Standalone (Spring Boot)
Ensure Java 21 is installed:
```bash
cd backend
./mvnw spring-boot:run
```
*The backend connects to `localhost:5432` and `localhost:11434`.*

### 3. Run Frontend Standalone (Vite Dev Server)
Ensure Node.js 18+ is installed:
```bash
cd frontend
npm install
npm run dev
```
*The frontend Vite dev server will run on `http://localhost:5173` with hot module replacement (HMR).*

---

## 🛠 Troubleshooting

### 1. Ollama model download hangs or fails
If your network connection drops during initial pull:
```bash
# Manually pull the models into the running ollama container
docker compose exec ollama ollama pull llama3.2
docker compose exec ollama ollama pull nomic-embed-text
```

### 2. Out of Memory (OOM) errors during inference
Ensure Docker Desktop has at least 8GB of memory allocated in **Settings → Resources → Memory**.

### 3. Port conflicts (5432, 8080, 11434, 5173)
If ports are already in use on your host machine, modify the port mappings in `.env` and `docker-compose.yml`.

### 4. Resetting the database and vectors
To perform a complete clean reset:
```bash
docker compose down -v
docker compose up -d
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
