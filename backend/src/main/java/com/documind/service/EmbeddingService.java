package com.documind.service;

import com.documind.model.SearchResponse;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.filter.Filter;
import static dev.langchain4j.store.embedding.filter.MetadataFilterBuilder.metadataKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmbeddingService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public void embedAndStore(List<String> chunks, UUID documentId, String fileName) {
        log.info("Embedding {} chunks for document {}", chunks.size(), fileName);
        List<TextSegment> segments = new ArrayList<>();
        
        for (int i = 0; i < chunks.size(); i++) {
            Metadata metadata = new Metadata();
            metadata.put("documentId", documentId.toString());
            metadata.put("fileName", fileName);
            metadata.put("chunkIndex", String.valueOf(i));
            
            segments.add(TextSegment.from(chunks.get(i), metadata));
        }

        List<Embedding> embeddings = embeddingModel.embedAll(segments).content();
        embeddingStore.addAll(embeddings, segments);
        log.info("Stored {} embeddings for document {}", embeddings.size(), fileName);
    }

    public List<SearchResponse.SearchResult> search(String query, int maxResults) {
        Embedding queryEmbedding = embeddingModel.embed(query).content();
        
        EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()
                .queryEmbedding(queryEmbedding)
                .maxResults(maxResults)
                .minScore(0.5)
                .build();
                
        EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(request);
        
        return searchResult.matches().stream()
                .map(this::mapToSearchResult)
                .collect(Collectors.toList());
    }

    private SearchResponse.SearchResult mapToSearchResult(EmbeddingMatch<TextSegment> match) {
        return new SearchResponse.SearchResult(
                match.embedded().text(),
                match.embedded().metadata().getString("fileName"),
                match.score(),
                match.embedded().metadata().asMap()
        );
    }

    public void deleteByDocumentId(UUID documentId) {
        // PGVector embedding store supports removing by metadata filter
        try {
            Filter filter = metadataKey("documentId").isEqualTo(documentId.toString());
            embeddingStore.removeAll(filter);
            log.info("Deleted embeddings for document: {}", documentId);
        } catch (Exception e) {
            log.warn("Failed to delete embeddings for document {}", documentId, e);
            // Note: If the store doesn't support filter delete, it throws an exception.
        }
    }
}
