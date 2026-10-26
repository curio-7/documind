-- ==============================================================================
-- DocuMind - Database Initialization Script
-- Executed on initial PostgreSQL container startup (via /docker-entrypoint-initdb.d)
-- ==============================================================================

-- 1. Enable pgvector extension for vector embeddings & similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- Table: documents
-- Stores metadata and status tracking for uploaded PDF documents
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    page_count INTEGER DEFAULT 0,
    chunk_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PROCESSING',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- Indexes for query optimization
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at DESC);

-- Note: The embedding table (e.g., langchain4j_embeddings) will be automatically
-- created and managed by LangChain4j's PgVectorEmbeddingStore at application runtime.
